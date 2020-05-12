const { useState, useEffect } = React


const asyncComponent = importComponent => { 
    return class extends Component { 
        state = {
            Com: null
        }
        async componentDidMount() {
            const { default: Com } = await importComponent()
            this.setState({
                Com
            })
        } 
        render(){
            const {Com} = this.state
            return (
                Com && <Com />
            )
        }
    }
}

export default asyncComponent; 