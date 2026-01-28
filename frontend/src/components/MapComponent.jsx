import React, { useEffect } from 'react';

const DISTRICT_OFFICES = {
    'Gangnam-gu': { lat: 37.51731, lng: 127.04750 },
    'Gangdong-gu': { lat: 37.53013, lng: 127.1237 },
    'Gangbuk-gu': { lat: 37.63976, lng: 127.0255 },
    'Gangseo-gu': { lat: 37.55096, lng: 126.84953 },
    'Gwanak-gu': { lat: 37.47837, lng: 126.95156 },
    'Gwangjin-gu': { lat: 37.53853, lng: 127.08238 },
    'Guro-gu': { lat: 37.49547, lng: 126.88753 },
    'Geumcheon-gu': { lat: 37.45690, lng: 126.89559 },
    'Nowon-gu': { lat: 37.65417, lng: 127.05659 },
    'Dobong-gu': { lat: 37.66873, lng: 127.04708 },
    'Dongdaemun-gu': { lat: 37.57452, lng: 127.03965 },
    'Dongjak-gu': { lat: 37.51243, lng: 126.93953 },
    'Mapo-gu': { lat: 37.56631, lng: 126.90207 },
    'Seodaemun-gu': { lat: 37.57908, lng: 126.93677 },
    'Seocho-gu': { lat: 37.48357, lng: 127.03269 },
    'Seongdong-gu': { lat: 37.56346, lng: 127.03697 },
    'Seongbuk-gu': { lat: 37.58940, lng: 127.01675 },
    'Songpa-gu': { lat: 37.51456, lng: 127.10592 },
    'Yangcheon-gu': { lat: 37.51702, lng: 126.86661 },
    'Yeongdeungpo-gu': { lat: 37.52644, lng: 126.89627 },
    'Yongsan-gu': { lat: 37.53234, lng: 126.99060 },
    'Eunpyeong-gu': { lat: 37.60275, lng: 126.92931 },
    'Jongno-gu': { lat: 37.57350, lng: 126.97899 },
    'Jung-gu': { lat: 37.56385, lng: 126.99760 },
    'Jungnang-gu': { lat: 37.60632, lng: 127.09258 }
};

const MapComponent = ({ notices, onMarkerClick }) => {
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780), // Seoul City Hall
                level: 8
            };

            const map = new window.kakao.maps.Map(container, options);
            const geocoder = new window.kakao.maps.services.Geocoder();

            // Default image (Blue - District Office)
            const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
            // Custom image (Red/Different - Housing) - Using a simple diff marker or color filter if possible
            // For now, we will use the standard star for District, and maybe a basic pin for houses if data exists.

            notices.forEach(notice => {
                const isRealAddress = notice.address && notice.address !== '서울시청' && notice.address.length > 5;

                // Helper to create marker
                const createMarker = (position, isReal) => {
                    // Jitter for overlap prevention if it's a district fallback
                    let finalPos = position;
                    if (!isReal) {
                        const jitter = () => (Math.random() - 0.5) * 0.005; // approx 500m jitter
                        finalPos = new window.kakao.maps.LatLng(
                            position.getLat() + jitter(),
                            position.getLng() + jitter()
                        );
                    }

                    // Use standard marker for Real Housing, Star marker for District Fallback
                    // Or vice versa. Let's make "Real" special.
                    const markerImage = isReal ? null : new window.kakao.maps.MarkerImage(
                        imageSrc,
                        new window.kakao.maps.Size(24, 35)
                    );

                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: finalPos,
                        image: markerImage,
                        title: notice.title // Native tooltip
                    });

                    // Infowindow
                    const iwContent = `<div style="padding:5px;width:150px;font-size:12px;color:black;">${isReal ? '🏠 ' : '🏢 '}${notice.title}</div>`;
                    const infowindow = new window.kakao.maps.InfoWindow({ content: iwContent });

                    // Click Event - Safe
                    window.kakao.maps.event.addListener(marker, 'click', function (mouseEvent) {
                        // Some Kakao events pass a mouseEvent, some don't depending on the API version. 
                        // Just in case it's a DOM event bubbling up.
                        if (mouseEvent && mouseEvent.preventDefault) {
                            mouseEvent.preventDefault();
                        }
                        if (onMarkerClick) onMarkerClick(notice);
                    });

                    window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
                    window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
                };

                if (isRealAddress) {
                    geocoder.addressSearch(notice.address, function (result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            createMarker(new window.kakao.maps.LatLng(result[0].y, result[0].x), true);
                        } else {
                            // Fallback to District
                            const districtPos = DISTRICT_OFFICES[notice.region];
                            if (districtPos) {
                                createMarker(new window.kakao.maps.LatLng(districtPos.lat, districtPos.lng), false);
                            }
                        }
                    });
                } else {
                    // Direct District Fallback
                    const districtPos = DISTRICT_OFFICES[notice.region];
                    if (districtPos) {
                        createMarker(new window.kakao.maps.LatLng(districtPos.lat, districtPos.lng), false);
                    } else {
                        // Default Seoul City Hall if region unknown, simple fallback
                        createMarker(new window.kakao.maps.LatLng(37.5665, 126.9780), false);
                    }
                }
            });
        }
    }, [notices]);

    return (
        <div id="map" style={{ width: '100%', height: '100%' }} className="rounded-lg shadow-md h-full min-h-[300px]"></div>
    );
};

export default MapComponent;
