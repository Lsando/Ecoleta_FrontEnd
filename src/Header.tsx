import React from 'react';
interface HeaderProps {
    title: string; // colocamos o "?" caso a variavel seja obrigatoria
}
const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
} 
export default Header;