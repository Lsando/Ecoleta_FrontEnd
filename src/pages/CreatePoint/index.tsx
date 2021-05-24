
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import './style.css';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
    id: number;
    title: string;
    image_url: string
};

interface IBGEUFResponse{
    sigla: string
}

interface IBGECITYResponse{
    nome: string
}
  
const CreatePoint = () => {
    
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [cities, setCities] = useState<string[]>([]);
    const [latitudeUser, setLatitude] = useState<number>(0); // before = selected position (lt)
    const [longitudeUser, setLongitude] = useState<number>(0); // before = selected postion for lgn
    //const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [initialLatitudePosition, setInitialLatitudePosition] = useState<number>(0);
    const [initialLongitudePosition, setInitialLogitudePosition] = useState<number>(0);
    const [selectedItem, setSelectedItem] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        });
    }, []);


    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const citiesName = response.data.map(city => city.nome);
            setCities(citiesName);
        });
    }, [selectedUf]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialLatitudePosition(latitude);
            setInitialLogitudePosition(longitude);
        })
    }, [])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent ) {
       setLatitude(event.latlng.lat)
       setLongitude (event.latlng.lng)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;

        setFormData({...formData, [name]: value});
    }
    function handleSelectedItem (id: number){
        
        const alreadySelected = selectedItem.findIndex(items => items === id);
        if (alreadySelected >= 0) {
            const filteredItems = selectedItem.filter(items => items !== id)
            setSelectedItem(filteredItems);
        } else {
            setSelectedItem([...selectedItem, id]);
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const latitude = latitudeUser;
        const longitude = longitudeUser;
        const items = selectedItem;

        const data = {
            name,
            email,
            city,
            whatsapp,
            uf,
            latitude,
            longitude,
            items
        };
        await api.post('/points/create', data);
        alert('Ponto de coleta criado!');
    }
    
    return (
        <div id="header">
        <div className="jumbotron">
            <h1 className="display-4">Ecoleta<span><img src={logo} alt="Ecoleta" /></span> </h1>
            <hr className="my-4"/>
            <div className="left-align">
            <Link to='/' className="btn btn-primary btn-lg" href="#" role="button" >
                <FiArrowLeft/>
                Voltar 
            </Link>
            </div>

        </div>
      
        <div id="page-create-point">
            <form onSubmit={handleSubmit}> 
                <h1>Cadastro de um Ponto de coleta</h1>
                <div className="form-group">
                    <fieldset>
                        <legend><h2>Dados</h2></legend>
                    </fieldset>
                    <label htmlFor="name">Nome da entidade</label> <br/>
                    <input type="text" name="name" id="name" className="form-control" onChange={handleInputChange} />
                    <div className="form-row">
                        <div className="col">
                            <label htmlFor="email">Email</label> <br/>
                            <input type="text" name="email" id="email" className="form-control" onChange={handleInputChange}/>
                        </div>

                        <div className="col">
                            <label htmlFor="whatsapp">Whatsapp</label> <br/>
                            <input type="text" name="whatsapp" id="whatsapp" className="form-control" onChange={handleInputChange}/>
                        </div>                  

                    </div>
                </div>
                <fieldset>
                    <h2 className="display-6">Endereco</h2>
                    <legend className="lead">Selecione um endereco no mapa</legend>
                         <Map center={[initialLatitudePosition, initialLongitudePosition]} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[latitudeUser, longitudeUser]} />
                    </Map>
                </fieldset>
                    
                
                <div className="form-group">
                    <fieldset>
                        <div className="form-row">
                            <div className="col">
                                <label htmlFor="uf">Estado (uf)</label>
                                <select name="uf" id="uf" onChange={handleSelectUf} value={selectedUf} className="form-control"><br/>
                                    <option value="0">Selecione um Estado</option>
                                    {ufs && ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col">
                                <label htmlFor="city">Cidade</label><br/>
                                <select onChange={handleSelectCity} value={selectedCity}  name="city" id="city" className="form-control">
                                    <option value="0">Selecione uma Cidade</option>
                                    {cities && cities.map(city => (
                                        <option value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            
                        </div>
                    </fieldset>
                </div>
                    
                <fieldset>
                    <legend className="display-6">Selecione o item</legend>
                    <ul className="list-group">
                        {items && items.map(item => (
                            <li 
                                className={ selectedItem.includes(item.id) ? 'list-group-item list-group-item-success' : 'list-group-item' } 
                                key={item.id}
                                onClick= {() => handleSelectedItem(item.id)} 
                            >
                            <img src={item.image_url} alt={item.title} /> 
                            <span>{item.title}</span>
                        </li>
                        ))}     
                    </ul>
                </fieldset>
                    
                
                <div className="col-s12">
                    <button className="btn btn-primary btn-sm" type="submit">
                        Registar produto
                    </button>
                </div>
                
            </form>
        </div>
        
    </div>
    )
}

export default CreatePoint;
