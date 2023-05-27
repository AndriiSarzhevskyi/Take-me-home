
export const ModalImage = (props) => {
    return (
        <div className='full-screen-image-div'>
            <img src={props.src} alt="img" className="img-full-screen"></img>
        </div>
    );
}