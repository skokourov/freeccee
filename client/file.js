import React from "react";
import axios from "axios";

class FileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.getName = this.getName.bind(this);
        this.startImport = this.startImport.bind(this);
    }

    getName(e) {
        var str = e.target.value;
        if (str.lastIndexOf('\\')) {
            var i = str.lastIndexOf('\\') + 1;
        }
        else {
            var i = str.lastIndexOf('/') + 1;
        }
        var filename = str.slice(i);
        this.refs.fileFormLabel.innerHTML = filename;
        this.refs.startButton.disabled = filename.length == 0;
    }

    startImport() {
        if (this.refs.upload.value !== "") {
            this.refs.startButton.disabled = true;
            var data = new FormData();
            data.append('file', this.refs.upload.files[0]);
            axios.post('/startImport', data)
                .then(res => {
                    console.log(res);
                    this.props.onStartImport(res.data.id);
                })
                .catch(function (err) {
                    this.props.onStartImportFailed("Запуск импорта не удался. Сервер недоступен.");
                    console.log(err);
                });
        }
    }

    componentDidMount() {
        this.refs.startButton.disabled = true;
    }

    importFinished() {
        this.refs.form.reset();
        this.refs.fileFormLabel.innerHTML = "";
        this.refs.startButton.disabled = true;
    }

    render() {
        return (
            <div className="row info_block">
                <form method="POST" encType="multipart/form-data" ref="form">
                    <div className="col-md-3 file_line_caption">
                        Файл для импорта:
                    </div>
                    <div className="col-md-6">
                        <div className="fileform">
                            <div id="fileformlabel" ref="fileFormLabel"></div>
                            <div className="selectbutton">Выбор...</div>
                            <input type="file" name="upload" id="upload" onChange={this.getName} ref="upload"
                                   accept=".xlsx,.xls"/>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <button type="button" className="import_start_button" name="import_start" id="import_start" ref="startButton"
                                onClick={this.startImport}>Начать импорт
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default FileUpload;