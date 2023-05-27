
import { Routes, Route, Navigate, /*Redirect*/ } from 'react-router-dom';
import { Main_dark } from './pages/main_dark'
import { RegistrationDark } from './pages/registration_dark';
import { Personal_information_Dark } from './pages/Personal_information_Dark';
import { EntranceDark } from './pages/entrance_dark';
import { CreateAd } from './pages/create_ad';
import { MyAds } from './pages/MyAds';
import { LostAds } from './pages/lost_ads';
import { FoundAds } from './pages/found_ads';
import { AdDetail } from './pages/ad_detail';
import { MyComments } from './pages/my_comments';
import { UsersList } from './pages/users_list';
import { UserDetail } from './pages/user_detail_info';

export const useRoutes = isAuthenticated => {
  if (isAuthenticated === true) {
    return (
      <Routes>
        <Route path="/" element={<Main_dark />}></Route>
        <Route path="/ad/:id" element={<AdDetail />}></Route>
        <Route path="/userdetailinfo/:id" element={<UserDetail />}></Route>
        <Route path="/user/:id" element={<Personal_information_Dark />}></Route>
        <Route path='/create' element={<CreateAd />}></Route>
        <Route path='/myads' element={<MyAds />}></Route>
        <Route path='/mycomments' element={<MyComments />}></Route>
        <Route path='/lost' element={<LostAds />}></Route>
        <Route path='/found' element={<FoundAds />}></Route>
        <Route path='/userslist' element={<UsersList/>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      {/* <Route path="/" element={<Main />}>
      </Route> */}
      <Route path="/ad/:id" element={<AdDetail />}></Route>
      <Route path="/" element={<Main_dark />}></Route>
      <Route path='/entrance' element={<EntranceDark />}></Route>
      <Route path='/registration' element={<RegistrationDark />}></Route>
      <Route path='/lost' element={<LostAds />}></Route>
      <Route path='/found' element={<FoundAds />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}