//var DriveTime = (function () {
//    var requestsPending = 0;

//    var _GetDriveTimePolygon = function (origin, driveTimeInMinutes, mapboxAccessToken, callback) {
//        var driveTimeInHours = driveTimeInMinutes / 60;
//        var driveTimeInSeconds = driveTimeInMinutes * 60;
//        var driveTimeTolerance = 0.1 * driveTimeInSeconds;
//        var maxDrivingSpeedInMph = 70; // assume a 70 mph avg driving speed
//        var radialDistanceInMiles = maxDrivingSpeedInMph * driveTimeInHours;
//        var radialDestinationPoints = [];
//        var driveTimePoints = [];

//        var originPointString = origin.lng + ',' + origin.lat;
//        // get all the points on the circumference of a circle with radius = targetDistanceInMiles (line of sight distance)
//        var originPoint = turf.point([origin.lng, origin.lat]);
//        var segmentSize = 10;
//        requestsPending = 360 / segmentSize;

//        for (var i = -180; i < 180; i += segmentSize) {
//            var destinationPoint = turf.destination(originPoint, radialDistanceInMiles, i, 'miles');

//            // add 2 more intermediate visit points to force the API down different routes that just a straight one to increase the granularity
//            // of the drive time polygon.
//            var intermediatePoint1 = turf.destination(originPoint, radialDistanceInMiles / 4, i, 'miles');
//            var intermediatePoint1String = intermediatePoint1.geometry.coordinates[0] + ',' + intermediatePoint1.geometry.coordinates[1];

//            var intermediatePoint2 = turf.destination(originPoint, radialDistanceInMiles / 2, i, 'miles');
//            var intermediatePoint2String = intermediatePoint2.geometry.coordinates[0] + ',' + intermediatePoint2.geometry.coordinates[1];

//            var destinationPointString = destinationPoint.geometry.coordinates[0] + ',' + destinationPoint.geometry.coordinates[1];
//            radialDestinationPoints.push(destinationPoint);

//            $.ajax({
//                url: 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originPointString + ";" + intermediatePoint1String + ";" + intermediatePoint2String + ";" + destinationPointString + '?steps=true&access_token=' + mapboxAccessToken,
//                method: 'GET'
//            }).done(function (result) {
//                var routePoints = TryLocateRoutePointsWithinDriveTime(result, originPoint, destinationPoint, driveTimeInSeconds, driveTimeTolerance);

//                for (var i = 0; i < routePoints.length; i++) {
//                    var duplicateValue = _.find(driveTimePoints, function (item) {
//                        return item.geometry.coordinates[0] == routePoints[i].geometry.coordinates[0] &&
//                               item.geometry.coordinates[1] == routePoints[i].geometry.coordinates[1]
//                    });

//                    if (duplicateValue == undefined) {
//                        driveTimePoints.push(routePoints[i]);
//                    }
//                }

//                --requestsPending;
//                GenerateDriveTimePolygon(driveTimePoints, callback, driveTimeInMinutes);
//            });
//        }
//    };

//    function TryLocateRoutePointsWithinDriveTime(directionResult, originPoint, destinationPoint, driveTimeInSeconds, driveTimeTolerance) {
//        var routePoints = [];
//        var route = directionResult.routes[0];
//        var routeLegs = route.legs;
//        var totalElapsedTime = 0;
//        var closestPointFartherThanTarget = destinationPoint;
//        var closestPointPriorToTarget = originPoint;

//        for (var r = 0; r < routeLegs.length ; r++) {
//            var routeSteps = routeLegs[r].steps;

//            if (Math.abs(route.duration - driveTimeInSeconds) <= driveTimeTolerance) {
//                routePoints.push(destinationPoint);
//            }
//            else {
//                for (var i = 0; i < routeSteps.length; i++) {
//                    var matched = false;
//                    totalElapsedTime += routeSteps[i].duration;
//                    var stepPoint = turf.point([routeSteps[i].maneuver.location[0], routeSteps[i].maneuver.location[1]]);

//                    if (Math.abs(totalElapsedTime - driveTimeInSeconds) <= driveTimeTolerance) {
//                        routePoints.push(stepPoint);
//                        matched = true;
//                        break;
//                    }
//                    else if (totalElapsedTime > driveTimeInSeconds) {
//                        closestPointFartherThanTarget = stepPoint;
//                        closestPointFartherThanTarget.ElapsedTimeUntilHere = totalElapsedTime;
//                        var calculatedPoint = CalculatePointWithinTargetDriveTime(closestPointPriorToTarget, closestPointFartherThanTarget, driveTimeInSeconds / 60);
//                        var duplicateValue = _.find(routePoints, function (item) {
//                            return item.geometry.coordinates[0] == calculatedPoint.geometry.coordinates[0] && item.geometry.coordinates[1] == calculatedPoint.geometry.coordinates[1]
//                        });

//                        if (duplicateValue == undefined) {
//                            routePoints.push(calculatedPoint);
//                        }

//                        matched = true;
//                        break;
//                    }
//                    else if (totalElapsedTime < driveTimeInSeconds) {
//                        closestPointPriorToTarget = stepPoint;
//                        closestPointPriorToTarget.ElapsedTimeUntilHere = totalElapsedTime;
//                    }
//                }

//                if (matched) { break; }
//            }
//        }

//        return routePoints;
//    };

//    function CalculatePointWithinTargetDriveTime(closestPointPriorToTarget, closestPointFartherThanTarget, driveTimeInMinutes) {
//        var calculatedPoint;
//        var distanceBetween = turf.distance(closestPointPriorToTarget, closestPointFartherThanTarget, 'miles');
//        var elapsedTimeBetween = Math.abs(closestPointFartherThanTarget.ElapsedTimeUntilHere - closestPointPriorToTarget.ElapsedTimeUntilHere);
//        var speed = distanceBetween / (elapsedTimeBetween / 3600);
//        var timeInSeconds = driveTimeInMinutes * 60;
//        var remainingDriveTime = Math.abs(timeInSeconds - closestPointPriorToTarget.ElapsedTimeUntilHere);
//        var distanceToTarget = speed * (remainingDriveTime / 3600);
//        var bearingBetween = turf.bearing(closestPointPriorToTarget, closestPointFartherThanTarget);
//        calculatedPoint = turf.destination(closestPointPriorToTarget, distanceToTarget, bearingBetween, 'miles');

//        return calculatedPoint;
//    };

//    function GenerateDriveTimePolygon(driveTimePoints, callback, driveTimeInMinutes) {
//        if (requestsPending == 0) {
//            var featureCollection = turf.featurecollection(driveTimePoints);
//            var driveTimePolygonGeoJSON = turf.concave(featureCollection, 100, 'miles');
//            var polygonSourceSuffix = "Drive Time :" + driveTimeInMinutes + " minutes";
//            callback(driveTimePolygonGeoJSON, polygonSourceSuffix);
//        }
//    };

//    return {
//        GetDriveTimePolygon: _GetDriveTimePolygon
//    }
//})();

define(["https://api.mapbox.com/mapbox.js/plugins/turf/v2.0.2/turf.min.js", "http://underscorejs.org/underscore-min.js"], function (turf, underscore) {

    requirejs.config({
        shim: {
            'underscore': {
                exports: '_'
            }
        }
    });

    var requestsPending = 0;

    var _GetDriveTimePolygon = function (origin, driveTimeInMinutes, mapboxAccessToken, callback) {
        var driveTimeInHours = driveTimeInMinutes / 60;
        var driveTimeInSeconds = driveTimeInMinutes * 60;
        var driveTimeTolerance = 0.1 * driveTimeInSeconds;
        var maxDrivingSpeedInMph = 70; // assume a 70 mph avg driving speed
        var radialDistanceInMiles = maxDrivingSpeedInMph * driveTimeInHours;
        var radialDestinationPoints = [];
        var driveTimePoints = [];

        var originPointString = origin.lng + ',' + origin.lat;
        // get all the points on the circumference of a circle with radius = targetDistanceInMiles (line of sight distance)
        var originPoint = turf.point([origin.lng, origin.lat]);
        var segmentSize = 10;
        requestsPending = 360 / segmentSize;

        for (var i = -180; i < 180; i += segmentSize) {
            var destinationPoint = turf.destination(originPoint, radialDistanceInMiles, i, 'miles');

            // add 2 more intermediate visit points to force the API down different routes that just a straight one to increase the granularity
            // of the drive time polygon.
            var intermediatePoint1 = turf.destination(originPoint, radialDistanceInMiles / 4, i, 'miles');
            var intermediatePoint1String = intermediatePoint1.geometry.coordinates[0] + ',' + intermediatePoint1.geometry.coordinates[1];

            var intermediatePoint2 = turf.destination(originPoint, radialDistanceInMiles / 2, i, 'miles');
            var intermediatePoint2String = intermediatePoint2.geometry.coordinates[0] + ',' + intermediatePoint2.geometry.coordinates[1];

            var destinationPointString = destinationPoint.geometry.coordinates[0] + ',' + destinationPoint.geometry.coordinates[1];
            radialDestinationPoints.push(destinationPoint);

            $.ajax({
                url: 'https://api.mapbox.com/directions/v5/mapbox/driving/' + originPointString + ";" + intermediatePoint1String + ";" + intermediatePoint2String + ";" + destinationPointString + '?steps=true&access_token=' + mapboxAccessToken,
                method: 'GET'
            }).done(function (result) {
                var routePoints = TryLocateRoutePointsWithinDriveTime(result, originPoint, destinationPoint, driveTimeInSeconds, driveTimeTolerance);

                for (var i = 0; i < routePoints.length; i++) {
                    var duplicateValue = _.find(driveTimePoints, function (item) {
                        return item.geometry.coordinates[0] == routePoints[i].geometry.coordinates[0] &&
                               item.geometry.coordinates[1] == routePoints[i].geometry.coordinates[1]
                    });

                    if (duplicateValue == undefined) {
                        driveTimePoints.push(routePoints[i]);
                    }
                }

                --requestsPending;
                GenerateDriveTimePolygon(driveTimePoints, callback, driveTimeInMinutes);
            });
        }
    };

    function TryLocateRoutePointsWithinDriveTime(directionResult, originPoint, destinationPoint, driveTimeInSeconds, driveTimeTolerance) {
        var routePoints = [];
        var route = directionResult.routes[0];
        var routeLegs = route.legs;
        var totalElapsedTime = 0;
        var closestPointFartherThanTarget = destinationPoint;
        var closestPointPriorToTarget = originPoint;

        for (var r = 0; r < routeLegs.length ; r++) {
            var routeSteps = routeLegs[r].steps;

            if (Math.abs(route.duration - driveTimeInSeconds) <= driveTimeTolerance) {
                routePoints.push(destinationPoint);
            }
            else {
                for (var i = 0; i < routeSteps.length; i++) {
                    var matched = false;
                    totalElapsedTime += routeSteps[i].duration;
                    var stepPoint = turf.point([routeSteps[i].maneuver.location[0], routeSteps[i].maneuver.location[1]]);

                    if (Math.abs(totalElapsedTime - driveTimeInSeconds) <= driveTimeTolerance) {
                        routePoints.push(stepPoint);
                        matched = true;
                        break;
                    }
                    else if (totalElapsedTime > driveTimeInSeconds) {
                        closestPointFartherThanTarget = stepPoint;
                        closestPointFartherThanTarget.ElapsedTimeUntilHere = totalElapsedTime;
                        var calculatedPoint = CalculatePointWithinTargetDriveTime(closestPointPriorToTarget, closestPointFartherThanTarget, driveTimeInSeconds / 60);
                        var duplicateValue = _.find(routePoints, function (item) {
                            return item.geometry.coordinates[0] == calculatedPoint.geometry.coordinates[0] && item.geometry.coordinates[1] == calculatedPoint.geometry.coordinates[1]
                        });

                        if (duplicateValue == undefined) {
                            routePoints.push(calculatedPoint);
                        }

                        matched = true;
                        break;
                    }
                    else if (totalElapsedTime < driveTimeInSeconds) {
                        closestPointPriorToTarget = stepPoint;
                        closestPointPriorToTarget.ElapsedTimeUntilHere = totalElapsedTime;
                    }
                }

                if (matched) { break; }
            }
        }

        return routePoints;
    };

    function CalculatePointWithinTargetDriveTime(closestPointPriorToTarget, closestPointFartherThanTarget, driveTimeInMinutes) {
        var calculatedPoint;
        var distanceBetween = turf.distance(closestPointPriorToTarget, closestPointFartherThanTarget, 'miles');
        var elapsedTimeBetween = Math.abs(closestPointFartherThanTarget.ElapsedTimeUntilHere - closestPointPriorToTarget.ElapsedTimeUntilHere);
        var speed = distanceBetween / (elapsedTimeBetween / 3600);
        var timeInSeconds = driveTimeInMinutes * 60;
        var remainingDriveTime = Math.abs(timeInSeconds - closestPointPriorToTarget.ElapsedTimeUntilHere);
        var distanceToTarget = speed * (remainingDriveTime / 3600);
        var bearingBetween = turf.bearing(closestPointPriorToTarget, closestPointFartherThanTarget);
        calculatedPoint = turf.destination(closestPointPriorToTarget, distanceToTarget, bearingBetween, 'miles');

        return calculatedPoint;
    };

    function GenerateDriveTimePolygon(driveTimePoints, callback, driveTimeInMinutes) {
        if (requestsPending == 0) {
            var featureCollection = turf.featurecollection(driveTimePoints);
            var driveTimePolygonGeoJSON = turf.concave(featureCollection, 100, 'miles');
            var polygonSourceSuffix = "Drive Time :" + driveTimeInMinutes + " minutes";
            callback(driveTimePolygonGeoJSON, polygonSourceSuffix);
        }
    };

    return {
        GetDriveTimePolygon: _GetDriveTimePolygon
    }
});