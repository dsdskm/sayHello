/* eslint-disable */
import { useEffect, useState, ChangeEvent } from "react";
import MemberDataHook from "api/MemberDataHook";
import { Member } from "interface/Member";
import { useNavigate } from "react-router-dom";
import { MAP_CENTER } from "common/Constant";
import { Box } from "@mui/system";
import { getAge, getPhoneFormat } from "common/Utils";
import {
  LABEL_LEVEL_HIGH,
  LABEL_LEVEL_LOW,
  LABEL_LEVEL_NORMAL,
  LABEL_LEVEL_VERY_HIGH,
  LABEL_LEVEL_VERY_LOW,
} from "./MemberEditView";

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
      if (map && data) {
        // marker
        let markerWidth = 30;
        let markerHeight = 30;
        let level = LABEL_LEVEL_VERY_LOW;
        switch (data.level) {
          case 1:
            markerWidth = 30;
            markerHeight = 30;
            level = LABEL_LEVEL_VERY_LOW;
            break;
          case 2:
            markerWidth = 40;
            markerHeight = 40;
            level = LABEL_LEVEL_LOW;
            break;
          case 3:
            markerWidth = 50;
            markerHeight = 50;
            level = LABEL_LEVEL_NORMAL;
            break;
          case 4:
            markerWidth = 60;
            markerHeight = 60;
            level = LABEL_LEVEL_HIGH;
            break;
          case 5:
            markerWidth = 70;
            markerHeight = 70;
            level = LABEL_LEVEL_VERY_HIGH;
            break;
          default:
            break;
        }
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(data.latitude, data.longitude),
          map: map,
          title: data.name,
          icon: {
            content: `
                <img alt="marker" width="${markerWidth}" height="${markerHeight}" src="http://maps.google.com/mapfiles/ms/micons/red.png" />
              `,
          },
        });
        marker_list.push(marker);
        const url = window.location.href + "/edit/" + data.id;
        // info window
        let infoWindow = new naver.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:10px;">
          <div><b>관심도 [${level}]</b></div>
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
