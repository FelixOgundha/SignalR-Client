import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [employees, setEmployees] = useState([])
  const latestEmployees = useRef(null);

  latestEmployees.current = employees;

  const getEmployees = () => {
    fetch("https://localhost:7083/api/Employees")
      .then(res => res.json())
      .then(
        (result) => {
          setEmployees(result)
        }).catch((error) => {
          console.log(error)
        }
        )
  }
  useEffect(() => {
    getEmployees()
    const connection = new HubConnectionBuilder()
      .withUrl('https://localhost:7083/hubs/employees')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(result => {
        console.log('Connected!');

        connection.on('ReceiveNewEmployee', employee => {
          const updatedEmployees = [...latestEmployees.current];
          updatedEmployees.push(employee);

          setEmployees(updatedEmployees);
        });
      })
      .catch(e => console.log('Connection failed: ', e));
  }, [])

  return (
    <div className="App container">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Department</th>
            <th scope="col">Position</th>
            <th scope="col">Salary</th>

          </tr>
        </thead>
        <tbody>
          {
            employees.map((item, key) =>
              <tr>
                <th scope="row" key={key}>{key + 1}</th>
                <td>{item.name}</td>
                <td>{item.department}</td>
                <td>{item.position}</td>
                <td>{item.salary}</td>
              </tr>
            )
          }

        </tbody>
      </table>
    </div>
  );
}

export default App;
