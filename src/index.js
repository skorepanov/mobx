import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import DevTools from 'mobx-react-devtools';
import { observable, configure, computed, action, decorate, runInAction } from 'mobx';
import { observer } from 'mobx-react';

configure({ enforceActions: 'observed' });

// #region Developers
class Store {
    devList = [
        { name: 'Jack', sp: 12 },
        { name: 'Max', sp: 10 },
        { name: 'Leo', sp: 8 }
    ];

    filter: '';

    get totalSum() {
        return this.devList
            .reduce((sum, { sp }) => sum += sp, 0);
    };

    get topPerformer() {
        const maxSp = Math.max(...this.devList.map(({ sp }) => sp));
        return this.devList.find(({ sp, name }) => {
            if (maxSp === sp) {
                return name;
            }
        });
    };

    get filteredDevelopers() {
        const matchesFilter = new RegExp(this.filter, 'i');
        return this.devList.filter(({ name }) => !this.filter || matchesFilter.test(name));
    }

    clearList() {
        this.devList = [];
    };

    addDeveloper(dev) {
        this.devList.push(dev);
    };

    updateFilter(value) {
        this.filter = value;
    }
}

decorate(Store, {
    devList: observable,
    filter: observable,
    totalSum: computed,
    topPerformer: computed,
    filteredDevelopers: computed,
    clearList: action,
    addDeveloper: action,
    updateFilter: action
});

const appStore = new Store();

const Row = ({ data: { name, sp } }) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{sp}</td>
        </tr>
    );
}

@observer class Table extends React.Component {
    render() {
        const { store } = this.props;

        return (
            <table>
                <thead style={{ fontWeight: 'bold' }}>
                    <tr>
                        <td>Name:</td>
                        <td>SP:</td>
                    </tr>
                </thead>
                <tbody>
                    {store.filteredDevelopers.map((dev, i) => <Row key={i} data={dev} />)}
                </tbody>
                <tfoot style={{color: 'green' }}>
                    <tr>
                        <td>Team SP:</td>
                        <td>{store.totalSum}</td>
                    </tr>
                    <tr>
                        <td>Top Performer</td>
                        <td>{store.topPerformer ? store.topPerformer.name : ''}</td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}

@observer class Controls extends React.Component {
    addDeveloper = () => {
        const name = prompt('The name:');
        const sp = parseInt(prompt('Story points:'), 10);
        this.props.store.addDeveloper({ name, sp });
    }

    clearList = () => { this.props.store.clearList(); }

    filterDevelopers = ({ target: { value } }) => {
        this.props.store.updateFilter(value);
    };

    render() {
        return (
            <div className='controls'>
                <button onClick={this.clearList}>Clear table</button>
                <button onClick={this.addDeveloper}>Add record</button>
                <input value={this.props.store.filter} onChange={this.filterDevelopers} />
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <DevTools />
                <h1>Sprint board:</h1>
                <Controls store={appStore} />
                <Table store={appStore} />
            </div>
        );
    }
}

ReactDOM.render(<App store={Store} />
    , document.getElementById('developers'));
// #endregion

// #region User
class UserStore {
    user: null;

    getUser() {
        const userUrl = 'https://randomuser.me/api/';
        fetch (userUrl)
            .then(result => result.json())
            .then(userContent => {
                if (userContent.results) {
                    runInAction(() => {
                        this.user = userContent.results[0];
                    });
                }
            });
    }
};

decorate(UserStore, {
    user: observable,
    getUser: action.bound
});

const userAppStore = new UserStore();

@observer class UserApp extends React.Component {
    render() {
        const { store } = this.props;

        return (
            <div>
                <DevTools />
                <button onClick={store.getUser}>Get user</button>
                <h1>{store.user ? store.user.login.username : 'Default name'}</h1>
            </div>
        );
    }
}

ReactDOM.render(<UserApp store={userAppStore} />
    , document.getElementById('user'));
// #endregion

// #region nickName
const nickName = observable({
    firstName: 'Yauhen',
    age: 30,

    get nickName() {
        console.dir('Generate nickName!');
        return `${this.firstName}${this.age}`;
    },

    increment() { this.age++ },
    decrement() { this.age-- }
}, {
    increment: action('Plus one'),
    decrement: action('Minus one')
}, {
    name: 'nickNameObservableObject'
});

@observer class Counter extends React.Component {
    handleIncrement = () => { this.props.store.increment() };
    handleDecrement = () => { this.props.store.decrement() };

    render() {
        return (
        <div className="App">
            <DevTools />
            <h1>{this.props.store.nickName}</h1>
            <h1>{this.props.store.age}</h1>
            <button onClick={this.handleDecrement}>-1</button>
            <button onClick={this.handleIncrement}>+1</button>
        </div>
        );
    }
}

ReactDOM.render(<Counter store={nickName} />
    , document.getElementById('root'));
// #endregion

serviceWorker.unregister();
