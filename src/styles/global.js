import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 7px;
  background-color: #fff;
  min-height: 100vh;
`;

export const FloatingButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

export const List = styled.div`
  margin: 0 5px;
`;

export const Footer = styled.div`
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: 3px;
  color: steelblue;
  font-size: 20px;
  font-weight: bold;
`;

export const Shadow = styled.div`
  border: 1px solid #ddd;
  border-bottom-width: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const GraphTitle = styled.div`
  color: #396884;
  font-size: 18px;
  margin: 3px;
  text-align: center;
`;

// Global CSS styles
export const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .btn:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }

  .btn-primary {
    background-color: #0A89A7;
    color: white;
  }

  .btn-success {
    background-color: #00C63C;
    color: white;
  }

  .btn-danger {
    background-color: #D50000;
    color: white;
  }

  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    margin: 5px 0;
  }

  .form-control:focus {
    outline: none;
    border-color: #0A89A7;
    box-shadow: 0 0 5px rgba(10, 137, 167, 0.3);
  }

  .card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin: 10px;
    padding: 20px;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .d-flex {
    display: flex;
  }

  .justify-content-center {
    justify-content: center;
  }

  .align-items-center {
    align-items: center;
  }

  .w-100 {
    width: 100%;
  }

  .h-100 {
    height: 100%;
  }
`;
