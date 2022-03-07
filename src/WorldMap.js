import { useEffect, useState, useRef } from "react";
import moment from "moment-timezone";
import './WorldMap.css';

class Center {
    constructor(data) {
        this.name = data.name;
        /*
         * グリニッジ(東経0)が中心の地図にマッピングする
         * 経度
         * 1. 西端(東経-180) を 0 にするため 180 を加える 0-360 度にする
         * 2. 0-360 = 0-100% で表すため、360 で割る。
         * 緯度 (赤道0度、北極90度、南極90度)
         * 1. 北極(北緯90) を 0 にするため 90 から引き、0-180度にする
         * 2. 0-180 = 0-100% で表すため、 180で割る。
         */
        this.x = (180 + data.long) / 360;
        this.y = (90 - data.lat) / 180;
        this.isActive = false;
    }

    distSqr = (x,y) => {
        const dx = this.x - x;
        const dy = this.y - y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        return dist;
    };

    activate = () => { this.isActive = true; }
    deactivate = () => { this.isActive = false; }
}

const WorldMap = () => {
    const [label, setLabel] = useState({name: "", time: ""});
    const [centers, setCenters] = useState([]);
    const [currentCenter, setCurrentCenter] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        fetch("https://momentjs.com/data/moment-timezone-meta.json")
            .then(response => response.json())
            .then(data => {
                let _centers = [];
                for (let name in data.zones) {
                    _centers.push(new Center(data.zones[name]));
                }
                setCenters(_centers);
            });
    }, []);

    const changeCenter = (center) => {
        if (center === currentCenter) {
            return;
        }

        if (currentCenter) {
            currentCenter.deactivate();
        }

        center.activate();
        const m = moment().tz(center.name);
        setLabel({name:center.name, time: m.format("yyyy-MM-DDTHH:mm ") + m.zoneAbbr()});
        setCurrentCenter(center);
    }

    const handleMouseMove = (e) => {
        /*
         * マウスの位置を地図のDIV上の割合に変換する
         */
        const box = mapRef.current.getBoundingClientRect();
        const px = e.nativeEvent.offsetX / box.width;
        const py = e.nativeEvent.offsetY / box.height;

        let dist;
        let closestDist = 100;
        let closestCenter;
        
        for (let i = 0; i < centers.length; i++) {
            dist = centers[i].distSqr(px,py);
            if (dist < closestDist) {
                closestCenter = centers[i];
                closestDist = dist;
            }
        }

        if (closestCenter) {
            changeCenter(closestCenter);
        }
    };

    const axisX = {left: currentCenter ? `${currentCenter.x * 100}%` : "0%"};
    const axisY = {top:  currentCenter ? `${currentCenter.y * 100}%` : "0%"};

    return (
        <div className="WorldMap">
            <h3 className="MapLabel">
                <span className="MapLabelName">{label.name}</span>&nbsp;
                <span className="MapLabelTime">{label.time}</span>
            </h3>
            <div className="MapWrap">
                <div className="MapInset" onMouseMove={handleMouseMove} ref={mapRef}>
                    <div className="MapAxisX" style={axisX}></div>
                    <div className="MapAxisY" style={axisY}></div>
                    {centers.map(center => {
                        const style = {
                            left: `${center.x * 100}%`,
                            top:  `${center.y * 100}%`
                        };
                        const className = center.isActive ? "Active" : "NotActive";
                        return (<span style={style} className={className} />);
                    })}
                </div>
            </div>
        </div>
    );
}

export default WorldMap;
