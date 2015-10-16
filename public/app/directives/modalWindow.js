'use strict';

angular
    .module('app')
    .directive('draggable', function ($document) {
        "use strict";
        return function (scope, element) {
            var startX = 0,
                startY = 0,
                x = 0,
                y = 0;
            element.css({
                position: 'fixed',
                cursor: 'move'
            });
            element.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                element.css({
                    top: y + 'px',
                    left: x + 'px'
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        };
    });
