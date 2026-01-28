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

            // Geocoder
            const geocoder = new window.kakao.maps.services.Geocoder();

            notices.forEach(notice => {
                // If ID is valid and has address
                if (notice.address) {
                    geocoder.addressSearch(notice.address, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                            const marker = new window.kakao.maps.Marker({
                                map: map,
                                position: coords
                            });

                            // Infowindow
                            const iwContent = `<div style="padding:5px;width:150px;font-size:12px;">${notice.title}</div>`;
                            const infowindow = new window.kakao.maps.InfoWindow({
                                content: iwContent
                            });

                            // Events
                            window.kakao.maps.event.addListener(marker, 'click', function () {
                                if (onMarkerClick) onMarkerClick(notice);
                            });
                            window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                                infowindow.open(map, marker);
                            });
                            window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                                infowindow.close();
                            });
                        } else {
                            // Fallback if address search fails (e.g. use Region + Random offset to prevent overlap)
                            // This keeps them in the general district area at least
                            console.warn("Geocoding failed for: " + notice.address);
                        }
                    });
                }
            });
        }
    }, [notices]);

    return (
        <div id="map" style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-md"></div>
    );
};

export default MapComponent;
