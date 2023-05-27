import { useEffect, useState } from 'react';
import { useHttp } from "../hooks/http.hook";
import { AutosuggestFilter } from './Autosuggest_filter';

export const FilterSidebar = (props) => {
    const { request, loading, error } = useHttp();
    const [options, setOptions] = useState();

    const [form, setForm] = useState({
        name: '', chipnumber: '', type: props.type, gender: '', category: '', date1: '', date2: '', state: '', district: '', place: '', sort: ''
    })
    const [district, setDistrict] = useState();
    const [state1, setState1] = useState();
    const [place, setPlace] = useState();

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
        console.log(event.target.value);
    }

    const filterHandler = async event => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            if (state1 != null) {
                formData.append("stateId", state1.value)
            }
            if (district != null) {
                formData.append("districtId", district.value)
            }
            if (place != null) {
                formData.append("placeId", place.value)
            }
            await request('/api/ad/getadsfilter', 'POST', formData).then(res => {
                console.log(res);
                console.log(res.data);
                props.setAds(res.data);
            });
        }
        catch (e) {
            if (error != null) {
                props.ToastErrorHandler(error);
            } else {
                props.ToastErrorHandler("Сталася помилка");
            }
        }
    }

    const resetfilterHandler = event => {
        event.preventDefault();
        const form = document.getElementById("filter-form");
        // const date1 = document.getElementById("date1");
        // const date2 = document.getElementById("date2");
        // date1.value = "";
        setForm({date1: "", date2: ""});
        // date2.value = "";
        form.reset();
    }

    return (
        <div className="sidebar" id="sidebar">
            <div className="flex-column flex-center margin-filter ">
                {/* <h1 className="h-about-txt">Пошук</h1> */}
                <h1 className="h-about-txt">Фільтрація</h1>
                <form className="flex-column flex-center" onSubmit={filterHandler} id="filter-form">
                    <div className="row-filter flex-column">
                        <input id = "chipnumber" type='text' name="chipnumber" className='filter-input' pattern="[0-9]*" minLength={15} maxLength={15} title="Будь ласка ведіть лише цифри" placeholder='000000000000000'></input>
                        <label htmlFor="chipnumber" className="lbl-filter" >Номер чіпу</label>
                    </div>
                    <div className="row-filter flex-column">
                        <input id = "name" type='text' name="name" className='filter-input' minLength="2" maxLength="30" placeholder='Кличка тварини або початкові літери'></input>
                        <label htmlFor="name" className="lbl-filter" >Кличка</label>
                    </div>
                    <div className="row-filter flex-column">
                        <select id = "type" className="filter-input" name="type" onChange={changeHandler}>
                            {props.type == "lost" ?
                                <><option value="lost">Зниклі </option> <option value="found">Знайдені</option></> :
                                <><option value="found">Знайдені</option> <option value="lost">Зниклі</option></>
                            }
                        </select>
                        <label htmlFor="type" className="lbl-filter" >Тип оголошення</label>
                    </div>
                    <div className="row-filter flex-column">
                        <select id = "gender" className="filter-input" name="gender" onChange={changeHandler}>
                            <option value="" selected>Стать</option>
                            <option value="man" >Чоловіча</option>
                            <option value="woman" >Жіноча</option>
                        </select>
                        <label htmlFor="gender" className="lbl-filter" >Стать тварини</label>
                    </div>
                    <div className="row-filter flex-column">
                        <select id = "category" className="filter-input" name="category" onChange={changeHandler}>
                            <option value="" selected>Категорія тварин</option>
                            <option value="cat" >Кішки</option>
                            <option value="dog" >Собаки</option>
                            <option value="another" >Інші</option>
                        </select>
                        <label htmlFor="category" className="lbl-filter" >Категорія тварин</label>
                    </div>
                    <div className="row-filter flex-column">
                        <label className="lbl-filter" >Дата</label>
                        <div className='flex-row filter-date'>
                            <input type='date' name="date1" id ="date1" autoComplete="off" className='filter-date-inp-1' onChange={changeHandler} defaultValue={form.date1}></input>
                            <input type='date' name="date2" id ="date2"   autoComplete="off" className='filter-date-inp-2' onChange={changeHandler} defaultValue={form.date2}></input>
                            <label htmlFor="date1" className="lbl-filter-date-1" >З</label>
                            <label htmlFor="date2" className="lbl-filter-date-2" >По</label>
                        </div>
                    </div>
                    <div className="row-filter flex-column">
                        <select id = "sort" className="filter-input" name="sort" onChange={changeHandler}>
                            <option value="ASC" >Спочатку новіші</option>
                            <option value="DESC" >Спочатку старі</option>
                        </select>
                        <label htmlFor="sort" className="lbl-filter" >Сортування</label>
                    </div>
                    <div className="row-filter flex-column">
                        <AutosuggestFilter name="state" citie={state1} setCitie={setState1}></AutosuggestFilter>
                        <label  className="lbl-filter" >Область</label>
                    </div>
                    <div className="row-filter flex-column">
                        <AutosuggestFilter name="district" citie={district} setCitie={setDistrict} state={state1}></AutosuggestFilter>
                        <label className="lbl-filter" >Район</label>
                    </div>
                    <div className="row-filter flex-column">
                        <AutosuggestFilter name="city" citie={place} setCitie={setPlace} state={state1} district={district}></AutosuggestFilter>
                        <label  className="lbl-filter" >Населений пункт</label>
                    </div>
                    <input type='submit' className='filter-submit' value="Пошук" />
                    <button className='filter-submit' onClick={resetfilterHandler}>Скинути фільтри</button>
                </form>
            </div>
        </div>
    )
}