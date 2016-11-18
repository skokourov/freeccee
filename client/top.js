import React from "react";
import axios from 'axios';

class Top extends React.Component {

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.state = {
            count : 0,
            datetime : "Неизвестно"
        };
    }
    componentDidMount() {
        this.loadData();
    }

    loadData() {
        axios.get(`/summary`)
            .then(res => {
                console.log(res);
                this.setState({ count : res.data.count, datetime:res.data.datetime });
            });
    }

    render() {
        return (
            <div className="row info_block">
                <div className="col-md-3 top_line_caption">Количество процедур:</div>
                <div className="col-md-3">{this.state.count}</div>
                <div className="col-md-3 top_line_caption">Дата импорта:</div>
                <div className="col-md-3">{this.state.datetime}</div>
            </div>
        );
    }
}

export default Top;