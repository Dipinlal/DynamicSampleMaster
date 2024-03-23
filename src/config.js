export let config = null;
export let BASE_URL = null
export let buttonColor1 = null;
export let autocompleteColor = null
export const loadConfig = async () => {
    const response = await fetch('/config.json');
    config = await response.json();
    BASE_URL = config.BASE_URL; 
    buttonColor1=config.buttonColor1;
    autocompleteColor=config.autocompleteColor
}