//primer codigo
import './App.css'
import TarjetaAprendiz from "./components/TarjetaAprendiz";
export default function App() {
return (
<main style={{
maxWidth: 520,
margin: "30px auto",
fontFamily: "sans-serif"
}}>
<h2>Aprendices ADSO</h2>
<TarjetaAprendiz
nombre="Jhon"
ficha={3223876}
programa="ADSO"
/>

<TarjetaAprendiz
nombre="Juan"
ficha={3144585}
programa="ADSO"
/>
</main>
);
}