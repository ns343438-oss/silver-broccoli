import React, { useEffect } from 'react';

const MapComponent = ({ notices, onMarkerClick }) => {
    useEffect(() => {
        // Kakao Map Script should be loaded in index.html
        // <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY"></script>

        if (window.kakao && window.kakao.maps) {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Seoul City Hall
                level: 8
            };

            const map = new window.kakao.maps.Map(container, options);

            // Markers
            notices.forEach(notice => {
                // Need coordinates. For now, random offset from center if coord generic
                // In real app, notice.address -> Geocoding -> LatLng

                // Dummy coords for demo
                const lat = 37.5665 + (Math.random() - 0.5) * 0.1;
                const lng = 126.9780 + (Math.random() - 0.5) * 0.1;

                const markerPosition = new window.kakao.maps.LatLng(lat, lng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);

                // Infowindow
                const iwContent = `<div style="padding:5px;">${notice.title} <br> Score: ${notice.score || 'N/A'}</div>`;
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: iwContent
                });

                // Click Event
                window.kakao.maps.event.addListener(marker, 'click', function () {
                    if (onMarkerClick) {
                        onMarkerClick(notice);
                    }
                });

                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                    infowindow.open(map, marker);
                });
                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                    infowindow.close();
                });
            });
        }
    }, [notices]);

    return (
        <div id="map" style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-md"></div>
    );
};

export default MapComponent;
