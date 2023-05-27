export const Circlephoto = (props) => {
    return (
        <div id="registration-photo" className="display-none photo">
            <img id="uploadPreview" className="uploadPreview" src={props.src} alt="img" />
        </div>
    );
}