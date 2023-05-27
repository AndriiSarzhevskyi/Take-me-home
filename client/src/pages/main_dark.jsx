import { useContext} from "react";
import { Link } from "react-router-dom"
import { HeaderDark } from "../components/Header_Dark"
import { AuthContext } from "../context/Auth.context";
export const Main_dark = () => {
  const auth = useContext(AuthContext);
  return (
    <div className="main-dark">
      <HeaderDark></HeaderDark>
      <div className="main-first-frame">
        <div className="main-text-block">
          <p>Наш вебзастосунок призначений для тих, хто не байдужий до долі братів наших менших.</p>
          <p>Ми зробимо все, щоб допомогти Вам знайти Вашого улюбленця, а Ви, у свою чергу, допоможіть загубленим пухнастикам знайти своїх хазяїв.</p>
        </div>
      </div>
      <div className="main-second-frame">
        <div className="grid-card-list">
          <div className="main-card">
            <h1 className="card-head">Знайдені</h1>
            <div className="card-text">Дізнайтесь про знайдених тварин, можливо, серед них є твій улюбленець. Передивіться фото тварин та зв’яжіться з людиною за номером, вкаазаним у анкеті.</div>
            <div className="card-img">
              <div className="card1-img"></div>
            </div>
            <Link className="card-link" to={`/found`}>Подивитися знайдених тварин</Link>
          </div>
          <div className="main-card">
            <h1 className="card-head">Зниклі</h1>
            <div className="card-text">Дізнайтесь про зниклих тваринок у твоєму місті та допоможи господарям  знайти своїх улюбленців. Для цього потрібно лише надати інформацію за номером або поштою, які вказані в анкеті зниклої тваринки.</div>
            <div className="card-img">
              <div className="card2-img"></div>
            </div>
            <Link className="card-link" to={`/lost`}>Подивитися зниклих тварин</Link>
          </div>
          <div className="main-card">
            <h1 className="card-head">Додати оголошення</h1>
            <div className="card-text">Заповніть анкету про свого вихованця, додайте короткий опис та фото, прикріпи свій номер телефону та електронну скриньку. Якщо вашу тварину хтось знайде, з Вами обов’язково зв’яжуться.</div>
            <div className="card-img">
              <div className="card3-img"></div>
            </div>
            {auth.isAuthenticated == true && <Link className="card-link" to={`/create`}>Створити оголошення</Link>}
            {auth.isAuthenticated == false && <Link className="card-link" to={`/entrance`}>Створити оголошення</Link>}
          </div>
        </div>
      </div>
    </div>

  )
}