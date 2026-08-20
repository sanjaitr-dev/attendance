import { useState,useEffect } from "react";

const useTheme = () => {

    const [theme,setTheme] = useState(()=>{
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme) return savedTheme;
        return window.matchMedia('prefers-color-scheme: dark').matches?'dark':'light';
    });

    useEffect(()=>{
        const root = document.documentElement;

        root.classList.remove('light','dark');

        root.classList.add(theme);
        root.setAttribute('data-theme',theme);

        localStorage.setItem('theme',theme);
    },[theme]);

    const toggleTheme = () => {
        setTheme(prev =>{
            const nextTheme = prev === 'light'? 'dark' : 'light';
            localStorage.setItem('theme',nextTheme);
            return nextTheme;
            });
    };

    return{theme, toggleTheme};
};

export default useTheme;