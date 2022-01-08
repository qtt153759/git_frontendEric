import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { getAllPatientForDoctor } from "../../../services/userService";
class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf("day").valueOf(),
            dataPatient: [], //thật ra ở đây dạng object thì backend gửi lên 1 array cx ghi đè thôi
        };
    }
    async componentDidMount() {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = new Date(currentDate).getTime();
        await this.getDataPatient(user, formattedDate);
    }
    getDataPatient = async (user, formattedDate) => {
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formattedDate,
        });
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data,
            });
        }
        console.log("res ", res);
    };
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }
    handleOnchangeDatePicker = (date) => {
        this.setState(
            {
                currentDate: date[0], //cái thằng thư viện này nó nhả ra 1 array=> lấy phần tử đầu tiên
            },
            // thay vì async await thì dùng call back , lưu ý không cần componentDidUpdate
            async () => {
                let { user } = this.props;
                let { currentDate } = this.state;
                let formattedDate = new Date(currentDate).getTime();
                await this.getDataPatient(user, formattedDate);
            }
        );
    };
    handleBtnConfirm = () => {};
    handleBtnRemedy = () => {};
    render() {
        console.log("hoidanit check state:", this.state);
        console.log("props", this.props);
        let { dataPatient } = this.state;
        return (
            <div className="manage-patient-container">
                <div className="m-p-title">Quản lý khám bệnh</div>
                <div className="manage-patient-body row">
                    <div className="col-4 form-group">
                        <label>Chọn ngày khám</label>
                        <DatePicker
                            onChange={this.handleOnchangeDatePicker}
                            className="form-control"
                            value={this.state.currentDate}
                        />
                    </div>
                    <div className="col-12 table-manage-patient">
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Giới tính</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                {dataPatient && dataPatient.length > 0 ? (
                                    dataPatient.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {item.patientData.firstName}
                                                </td>
                                                <td>
                                                    {item.patientData.address}
                                                </td>
                                                <td>
                                                    {
                                                        item.patientData
                                                            .genderData.valueVi
                                                    }
                                                </td>
                                                <td>{item.statusId}</td>
                                                <td>
                                                    <button
                                                        className="mp-btn-confirm"
                                                        onClick={() =>
                                                            this.handleBtnConfirm()
                                                        }
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        className="mp-btn-remedy"
                                                        onClick={() =>
                                                            this.handleBtnRemedy()
                                                        }
                                                    >
                                                        Gửi hóa đơn
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>No data</tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
