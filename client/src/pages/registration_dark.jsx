import {Link, useNavigate} from "react-router-dom"
import { useHttp } from "../hooks/http.hook";
import {  useState, useEffect, useContext} from 'react';
import { showError, clearError, checkFields, initTimer, timer, showhidepassHandler} from "../functions";
import { CloseSvg } from "../components/Close_svg";
import { HeaderDark } from "../components/Header_Dark";
import {Checkcodeform} from "../components/Check_code_form"
import {Circlephoto} from "../components/Circle_photo"
export const RegistrationDark = () => {
    const {request,/*loading,*/ error} = useHttp();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', surname: '', age: '', gender: '',email: '', password: '', photo: ''
    })
    const [photobase64, setPhotobase4] = useState();
    const [code, setCode] = useState();
    
    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value }) 
        console.log(event.target.value);
    }
    
    useEffect(()=>{
        if(error){
            showError(error);
        }
      },[error]);
    
    const sendCodeHandler = async event => {
        event.preventDefault();
        const regform = document.getElementById("regform");
        const formData = new FormData(regform);
        const dialog = document.getElementById("dialog-code-check");
        if(checkFields("password", "lblpassword") === true){
            try {
                clearError();
                await request('/api/email/sendkode', 'POST', formData).then(res => {
                    setCode(res.code);
                    if(!dialog.open){

                        dialog.showModal();
                    }
                    clearInterval(timer);
                    initTimer();
                });

            } catch (e) {}
        }
    }

    
    const changeStatusdialog = async event =>{
        await registerHandler();
    }

    const registerHandler = async event => {
        const regform = document.getElementById("regform");
        // console.log(photobase64);
        const formData = new FormData(regform);
        console.log(formData);
        formData.append('photobase64', photobase64);
        if(checkFields("password", "lblpassword") === true){
          try {
            clearError();
            await request('/api/auth/register', 'POST', formData).then(res => {
                if(res.message == "Пользователь создан"){
                    navigate("/entrance");
                   
                }
            })
          } catch (e) {}
        }
      }

    function filechangehandler(event){
        let fileName = '';
        let label = event.target.nextElementSibling;
        setForm({...form, [event.target.name]: event.target.files[0]});
        
        const labelVal = "Оберіть фото";
        if( event.target.files && event.target.files.length > 1 )
            fileName = ( event.target.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', event.target.files.length );
        else
            fileName = event.target.value.split("\\").pop(); console.log(fileName);
    
        if( fileName ){
            label.innerHTML = fileName;
            let oFReader = new FileReader();
            oFReader.readAsDataURL(event.target.files[0])
            
            oFReader.onload = function (oFREvent) {
                console.log(oFREvent.target.result);
                setPhotobase4(oFREvent.target.result);
                document.getElementById("uploadPreview").src = oFREvent.target.result;
            }
            document.getElementById("registration-photo").classList.remove("display-none");
            document.getElementById("registration-photo").classList.add("display-flex-center");
        }
        else{
            document.getElementById("registration-photo").classList.add("display-none");
            label.innerHTML = labelVal;
        }
    }
    
    let age = [];
    for(let i = 6; i < 80; i++){
        age.push(i);
    }

    const options = age.map((text, index) => {
        return <option key={index} value={text}>{text}</option>;
    });

    return(
        <div className = "main-dark">
            <HeaderDark></HeaderDark>
            <div className="main-second-frame flex-column ">
            <div className="form-block form-castom margin-registration">
                <h1 className="form-h">Реєстрація</h1>

                    <form className="form-dark flex-column" id = "regform" onSubmit={sendCodeHandler}>
                        <div id = "registration-photo" className="display-none photo">
                            <img id="uploadPreview" className="uploadPreview" src={""} alt="img"/>
                        </div>
                        <div className = "row-dark flex-column">
                            <div id = "error" className= "error display-none">dsss</div>
                        </div>
                        <div className = "row-dark flex-column">
                            <input className = "dark-inp" required type="text" minLength="2" maxLength="30" name = "name" placeholder="Введіть ім'я" onChange={changeHandler}/>
                            <label htmlFor = "name" className = "lb1">Ім'я</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <input className = "dark-inp" required type="text" minLength="2" maxLength="30" name = "surname" placeholder="Введіть прізвище" onChange={changeHandler}/>
                            <label htmlFor = "surname" className = "lb1">Прізвище</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <input className="dark-inp" name="age" required type="date" max="2018-01-01" onChange={changeHandler}></input>
                            <label htmlFor = "age"  className = "lb1">Дата народження</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <select className="dark-inp" name="gender" onChange={changeHandler} required>
                                <option value="">--Будь-ласка оберіть стать--</option>
                                <option value="man">Чоловік</option>
                                <option value="woman">Жінка</option>
                            </select>
                            <label htmlFor = "gender" className = "lb1">Стать</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <input className = "dark-inp" required type="email" minLength="4" maxLength="80" name = "email"  placeholder="Введіть email" onChange={changeHandler}/>
                            <label htmlFor = "email" className = "lb1">Електронна пошта</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <div className="pass"><input className= "dark-inp paswidth" required type="password"  id="password" name = "password" placeholder="Введіть пароль" onChange={changeHandler}/>
                            <button className="password-control"  type='button' onClick={showhidepassHandler}></button></div>
                            <label htmlFor = "password" className="lb1" id = "lblpassword">Пароль</label>
                        </div>
                        <div className = "row-dark flex-column">
                            <input className= "inp-file" required type="file"  id="photo" name = "photo" onChange={filechangehandler} accept =".jpg, .png, .gif"/>
                            <label htmlFor = "photo" className="lb-photo">Оберіть фото</label>
                            <label  className="lb1">Фото</label>
                        </div>
                        <input type="submit" className="submit-dark" value="Зареєструватися" />
                    </form>
                    <dialog id="dialog-code-check" className="dialog-code">
                        <CloseSvg id = {"dialog-code-check"}></CloseSvg>
                        <Checkcodeform code={code} sendcodeHandler={sendCodeHandler} changeStatusdialog={changeStatusdialog} h-text = "Підтвердження дії"></Checkcodeform>
                    </dialog>
            </div>
            </div>
        </div>
        
    )
}