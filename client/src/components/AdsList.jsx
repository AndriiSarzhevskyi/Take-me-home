import { useEffect, useState } from "react"
import { Link } from "react-router-dom";


export const AdsList = (props) => {
    const [statusPart, setStatusPart] = useState();
    // const [shortabout, setShortabout] = useState();

    useEffect(() => {
        // console.log(props.ad);
        // console.log(props.ad.AdId);
        if (props.ad.type == "found" && props.ad.status != "Знайдено") {
            const spaceIndex = props.ad.status.indexOf(' ');
            let tmp = [];
           
            tmp.push(props.ad.status.substring(0, spaceIndex));
            tmp.push( props.ad.status.substring(spaceIndex + 1));
            setStatusPart(tmp);
        }
        // if (props.ad.About.length > 100) {
        //     setShortabout(props.ad.About.slice(0, 60) + "...");
        // }
    }, [props]);

    return (
        <div className="ad-card flex-row">
            <div className="ad-img-container flex-row flex-justify-center">
                <img className="ad-img" src={props.ad.Pet.Photo_avatars[0].ImagePath}></img>
            </div>
            <div className="ad-info flex-column">
                <table className="ad-table">
                    <tbody className="ad-tbody">
                        <tr>
                            {props.ad.type == "lost" &&
                                (props.ad.Pet.gender == "man"
                                    ? <td className="font-weight-bold">Зник:</td>
                                    : <td className="font-weight-bold">Зникла:</td>
                                )
                            }
                            {props.ad.type == "found" &&
                                (props.ad.Pet.gender == "man"
                                    ? <td className="font-weight-bold">Знайдено:</td>
                                    : <td className="font-weight-bold">Знайдено:</td>
                                )
                            }
                            <td>{props.ad.Date}</td>
                        </tr>
                        <tr>
                            <td className="font-weight-bold">Статус:</td>
                            {props.ad.type == "lost" && <td className="font-size-15" >{props.ad.status}</td>}
                            {props.ad.type == "found" && statusPart != null && <td className="font-size-15" >{statusPart[0]}<br></br>{statusPart[1]} </td>}
                            {props.ad.type == "found" && statusPart == null && <td className="font-size-15" >{props.ad.status}</td>}
                        </tr>
                        <tr>
                            <td className="font-weight-bold">Кличка:</td>
                            <td>{props.ad.Pet.name}</td>
                        </tr>
                        <tr>
                            <td className="font-weight-bold">Де:</td>
                            <td>{props.ad.Ukraine.name_uk}</td>
                        </tr>
                        <tr className="font-weight-bold">
                            <td className="text-align">Опис:</td>
                            {/* <td>{shortabout}</td> */}
                        </tr>
                        <tr><td colSpan="2" className="padding-none">
                            {props.ad.About.length > 60 ? (props.ad.About.slice(0, 60) + "...") : props.ad.About}
                        </td></tr>
                    </tbody>
                </table>
                <Link to={`/ad/${props.ad.AdId}`} className="ad-link">Дізнатися більше</Link>
            </div>
        </div >
    )
}