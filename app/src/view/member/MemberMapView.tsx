/* eslint-disable */
import { useEffect, useState, ChangeEvent } from "react";
import MemberDataHook from "api/MemberDataHook";
import { Member } from "interface/Member";
import { useNavigate } from "react-router-dom";
import { MAP_CENTER } from "common/Constant";
import { Box } from "@mui/system";
import { getAge, getPhoneFormat } from "common/Utils";

const MemberMapView = () => {
  const { memberList } = MemberDataHook();

  let map: naver.maps.Map;
  let marker_list: Array<naver.maps.Marker> = [];
  let infoWindow_list: Array<naver.maps.InfoWindow> = [];

  useEffect(() => {
    const onMarkerClick = (i: number) => {
      return function (e: any) {
        const marker = marker_list[i];
        const infoWindow = infoWindow_list[i];
        infoWindow.open(map, marker);
      };
    };
    const addMarker = (data: Member) => {
      if (map) {
        // marker
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(data.latitude, data.longitude),
          map: map,
          title: data.name,
          icon: {
            content: `
                <img alt="marker" src="http://maps.google.com/mapfiles/ms/micons/red.png" />
              `,
          },
        });
        marker_list.push(marker);
        const url = window.location.href+"/edit/"+data.id
        // info window
        let infoWindow = new naver.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:10px;">
          <div><img width=100 height=100 src=${data.image}/></div>
          <div><b>${data.name}(${getAge(data.age)}세)</b></div>
          <div><b>${data.address}</b></div>
          <div><b>${getPhoneFormat(data.phone)}</b></div>
          <div><a href="${url}" >상세보기</a></div>
          </div>`,
        });
        infoWindow_list.push(infoWindow);
      }
    };
    const initMap = () => {
      try {
        map = new naver.maps.Map("map", {
          center: MAP_CENTER,
          zoom: 12,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          zoomControl: true,
        });
        if (memberList) {
          marker_list = [];
          infoWindow_list = [];
          memberList.forEach((data) => {
            addMarker(data);
          });
          for (let i = 0; i < marker_list.length; i++) {
            naver.maps.Event.addListener(marker_list[i], "click", onMarkerClick(i));
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    initMap();
  }, [memberList]);

  return (
    <>
      <Box display="flex" justifyContent="center" sx={{ m: 5 }}>
        <div id="map" style={{ height: 1000, width: 1000 }}></div>
      </Box>
    </>
  );
};

export default MemberMapView;
