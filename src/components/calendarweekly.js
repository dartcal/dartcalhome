/* eslint no-alert: 0 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
//import Modal from "./addeventmodal";
import { Input } from 'reactstrap';
import firebase from 'firebase';
import logo from '../pictures/calendar.png';
import userpic from '../pictures/user.png';
import search from '../pictures/magnifying-glass.png'
import plus from '../pictures/plus.png';
import { NavLink, withRouter } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '../cssfolder/calendar.css' 
import timeGridPlugin from '@fullcalendar/timegrid';


class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  handleCancelButtonClick = (event) => {
    this.props.history.push('/');
  }


  render() {
    return (
      <div className="allCal">
      <div className="calSearchBar">
        <img width="30px" src={search} style={{ 'vertical-align':'middle' }}/>
        <input type="text" width="10px" placeholder="Search" className="shortSearch" ></input>
      </div>
      <div className="cal">
      <FullCalendar 
        dateClick={this.handleDateClick} 
        plugins={[ timeGridPlugin ]} 
        events={[
          { title: 'lily', date: '2020-05-01' },
          {title: 'is better', date: '2020-05-02'},
          { title: 'than Scott', date: '2020-05-02' }
          ]}
      />
      </div>
      <div className="dartCalLogoCal">
        DartCal
        <div className="scheduleLogo"><img width="30px" src={logo} /></div>
      </div>
      <div className="addEventModal">
        <Modal show={this.state.show} handleClose={this.hideModal}>  </Modal>
      </div>
      <div className="sidebar">
         <div className="addNewEvent">
            <img width="20px" src={plus}/> 
            <Button onClick={this.showModal}>Add Event</Button>
         </div>
         <div className="toggleMonthWeek">
          <NavLink to="/calendarmonthly">Monthly View</NavLink>
         </div>
         <div className="toggleCalendarView">
           Calendar View Options
           <div className="checkbox"> 
            <input type="checkbox"></input> Classes
           </div>
           <div className="checkbox"> 
            <input type="checkbox"></input> Clubs
           </div>
           <div className="checkbox"> 
            <input type="checkbox"></input> Social Events
           </div>
           <div className="checkbox"> 
            <input type="checkbox"></input> Other
           </div>
        </div>
        <div className="friendsCal">
          <div>Friend's Calendars</div>
          <div style={{color: '#1D263B' }}> 
            <img width="20px" src={plus}/> 
            Add Friend
          </div>
        </div>
         <div className="calProfileIcon">
            <img width="50px" src={userpic} style={{ 'vertical-align':'middle', 'mix-blend-mode': 'soft-light'}}/> 
            <NavLink to="/profile">Profile</NavLink>
         </div>
      </div>
      </div>
    )
  }
}

const Modal = ({ handleClose, show }) => {
  if (show){
    return (
      <div className="modal">
            <div className="modalTitle"><br></br>Add New Event</div>
        <div className="newEventInfo">
            <div className="inputline"> 
              Name: &nbsp;
              <Input type="text" placeholder="Event Name"/>
            </div>
            <div className="inputline"> 
              <Input  type="radio" name="eventType"/>Classes &nbsp;
              <Input  type="radio" name="eventType"/>Clubs &nbsp;
              <Input  type="radio" name="eventType"/>Social &nbsp;
              <Input  type="radio" name="eventType"/>Other &nbsp;
            </div>
            <div className="inputline" > 
              Date: &nbsp;
              <Input type="date"/>
            </div>
            <div className="inputline"> 
              Time: &nbsp;
              <Input type="time"/>
            </div>
        </div>
        <div className="enterorcancelbuttons" id="longButtons">
          <Button> Save </Button> &nbsp;
          <Button onClick={handleClose}> Close </Button>
        </div>
    </div>
    );
  }
    return (null)
};


const container = document.createElement('div');
document.body.appendChild(container);
NavLink.render(<Calendar />, container);


// export default NewPost;
export default withRouter((Calendar));

