import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { Card, Tag } from "antd";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const MapComponent = ({ session }) => {
  const router = useRouter();
  const { shopCoordinates } = useSelector((state) => state.shop);

  return (
    <Map
      center={{ lat: session.lat, lng: session.lng }}
      style={{ width: "100%", height: "360px" }}
      level={5}
    >
      {session && session.division === false && (
        <CustomOverlayMap key={session.id} position={{ lat: session.lat, lng: session.lng }}>
          <Tag key={session.id}>{session && session.name}</Tag>
        </CustomOverlayMap>
      )}
      {shopCoordinates &&
        shopCoordinates.length > 0 &&
        shopCoordinates.map((result, index) => {
          const ids = session.Shops.filter((v) => v.id == result.ShopId);
          return (
            <CustomOverlayMap
              position={{
                lat: result.location.coordinates[1],
                lng: result.location.coordinates[0],
              }}
              key={index}
            >
              <Tag
                key={index}
                style={{ cursor: "pointer" }}
                color={ids.length === 0 ? null : "magenta"}
                onClick={() => {
                  if (ids.length == 0) {
                    return router.push(`/menu/${result.ShopId}`);
                  } else {
                    return router.push(`/shop/admin`);
                  }
                }}
              >
                {result.name}
              </Tag>
            </CustomOverlayMap>
          );
        })}
    </Map>
  );
};

export default MapComponent;
