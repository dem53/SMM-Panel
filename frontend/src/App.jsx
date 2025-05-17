import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnasayfaPage from './pages/Anasayfa';
import LoginPage from './pages/Login';
import YonetimPage from './pages/Yonetim'
import UrunYonetimi from './pages/UrunYonetimi';
import KullaniciYonetimi from './pages/KullanıcıYonetimi';
import SepetimPage from './pages/Sepetim';
import FavorilerimPage from './pages/Favoriler';
import InstagramHizmetler from './pages/InstagramHizmetler';
import OdemePage from './pages/Ödeme';
import SiparisYonetimi from './pages/SiparisYonetimi';


function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<AnasayfaPage />} />
          <Route path='/giris' element={<LoginPage />} />
          <Route path='/yonetim' element={<YonetimPage />} />
          <Route path='/yonetim/urunler' element={<UrunYonetimi />} />
          <Route path='/yonetim/siparis' element={<SiparisYonetimi />} />
          <Route path='/yonetim/kullanici' element={<KullaniciYonetimi />} />

          <Route path='/sepetim' element={<SepetimPage />} />
          <Route path='/favorilerim' element={<FavorilerimPage />} />

          <Route path='/odeme' element={<OdemePage />} />


          <Route path='/instagram-paketler' element={<InstagramHizmetler />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
