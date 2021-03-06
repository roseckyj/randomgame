import React from 'react';
import { GameCore } from './gameMechanics/GameCore';
import { loadTextures } from '../shared/gameObjects/renderers/textures/textureEngine';

interface IAppProps {}

interface IAppState {
    status: 'loading' | 'ingame';
    textures: {
        loaded: number;
        of: number;
    };
}

class App extends React.Component<IAppProps, IAppState> {
    apiUrl = 'https://randombot-server.herokuapp.com/';

    state: IAppState = {
        status: 'loading',
        textures: {
            loaded: 0,
            of: 0,
        },
    };

    constructor(props: IAppProps) {
        super(props);

        if (window.location.host.includes('localhost')) {
            this.apiUrl = 'http://localhost:80/';
        }
    }

    componentDidMount() {
        this.setState({
            textures: {
                loaded: 0,
                of: loadTextures(
                    () => {
                        this.setState({ status: 'ingame' });
                    },
                    (loaded, of) => {
                        this.setState({
                            textures: {
                                loaded,
                                of,
                            },
                        });
                    },
                ),
            },
        });
    }

    render() {
        return (
            <>
                {this.state.status === 'loading' && (
                    <div className="center">
                        Načítání textur... ({this.state.textures.loaded}/{this.state.textures.of})
                    </div>
                )}
                {this.state.status === 'ingame' && <GameCore apiUrl={this.apiUrl} />}
            </>
        );
    }
}

export default App;
