/* eslint no-alert: 0 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Input } from 'reactstrap';
import firebase from 'firebase';
import logo from '../pictures/DartCalLogo.png';
import settings from '../pictures/settings.png';
import noUserPic from '../pictures/noUser.png'
import blankPic from '../pictures/nofriend.png'
import { NavLink, withRouter } from 'react-router-dom';
import * as db from './datastore';
import '../cssfolder/profile.css';
import noFriends from '../pictures/nofriend.png';
import Modal from './profilemodal';
import arrow from '../pictures/downarrow.png'



class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false, 
      userID: 'no user ID',
      userEmail: 'no email',
      userFirstName: ' first ',
      userLastName: ' last ',
      userFullName: 'username',
      userYear: 'no year',
      image: noUserPic,

      friendsIDs: [],
      friendsPics: [],
      friendsNames: [],

      bio: '',
      
      newClub: '',
      newClass: '',
      classes: '',
      classList: [],
      clubList: [],
      editing: false,

      classBlockMap: new Map(),
    };  
    }

  
  componentDidMount() {
    db.getCurrUser(this.setCurrUser);
    this.setClassBlockMap();
  }

  setClassBlockMap = () => {
    this.state.classBlockMap.set('8', {startTime: '07:45:00', 
                  endTime: '08:35:00',
                  daysOfWeek: ['1', '2', '4', '5']})
    .set('9S', {startTime: '09:05:00', 
                  endTime: '09:55:00',
                  daysOfWeek: ['1', '2', '4', '5']})
    .set('9L', {startTime: '8:50:00', 
                  endTime: '9:55:00',
                  daysOfWeek: ['1', '3', '5']})
    .set('10A', {startTime: '10:10:00', 
                  endTime: '12:00:00',
                  daysOfWeek: ['2', '4']})
    .set('10', {startTime: '10:10:00', 
                  endTime: '11:15:00',
                  daysOfWeek: ['1', '3', '5']})
    .set('11', {startTime: '11:30:00', 
                  endTime: '12:35:00',
                  daysOfWeek: ['1', '3', '5']})
    .set('12', {startTime: '12:50:00', 
                  endTime: '13:55:00',
                  daysOfWeek: ['1', '3', '5']})
    .set('2', {startTime: '14:10:00', 
                  endTime: '15:15:00',
                  daysOfWeek: ['1', '3', '5']})
    .set('2A', {startTime: '14:25:00', 
                  endTime: '16:15:00',
                  daysOfWeek: ['2', '4']})
    .set('3A', {startTime: '15:30:00', 
                  endTime: '17:20:00',
                  daysOfWeek: ['1', '4']})
    .set('3B', {startTime: '16:30:00', 
                  endTime: '18:20:00',
                  daysOfWeek: ['2', '4']})
    .set('6A', {startTime: '15:30:00', 
                  endTime: '17:20:00',
                  daysOfWeek: ['1', '3']})
    .set('6B', {startTime: '18:30:00', 
                  endTime: '21:30:00',
                  daysOfWeek: ['3']})                            
  }

  
  setCurrUser = (currUser) => {
    

     this.setState({
        isOpen: false, 
        userID: currUser.userID,
        userEmail: currUser.userEmail,
        userFirstName: currUser.userFirstName,
        userLastName: currUser.userLastName,
        userYear: currUser.userYear,
        image: currUser.userPic,
        editing: false,
      });

      if(currUser.Clubs != null) {
      var ClubList = []
      for (let i = 0; i < Object.keys(currUser.Clubs).length; i += 1) {
        const currentKey = Object.keys(currUser.Clubs)[i];
        const currItem = currUser.Clubs[currentKey];
  
        ClubList.push(currItem);

        this.setState ({
          clubList: ClubList,

        })
    
      }
    }

    if(currUser.Classes != null) {
    var Class = []
      for (let i = 0; i < Object.keys(currUser.Classes).length; i += 1) {
        const currentKey = Object.keys(currUser.Classes)[i];
        const currItem = currUser.Classes[currentKey];
  
       Class.push(` ${currItem} (${currentKey})`);

       this.setState ({
         classList: Class
       })
    
      }
    }
    if(currUser.Friends != null) {
    this.state.friendsPics = []
    this.state.friendsNames = []

    for (let i = 0; i < Object.keys(currUser.Friends).length; i += 1) {
      const currentKey = Object.keys(currUser.Friends)[i];
      const currItem = currUser.Friends[currentKey];
     db.getUser(currItem, this.setFriendInfo);
    
    }
  }
  
  }
  
  setFriendInfo = (user) => {
    var pics = this.state.friendsPics
    var names = this.state.friendsNames
    var IDs = this.state.friendsIDs
    pics.push(user.userPic);
    names.push(`${user.userFirstName} ${user.userLastName}`);
    IDs.push(user.userID);

    this.setState({
      friendsPics: pics,
      friendsNames: names,
      friendsIDs: IDs,
    })
  }

  onYearChange = (event) => {
    this.setState({userYear: event.target.value});
  }
  onImageChange = (event) => {
    this.setState({image: event.target.value});
  }
 
  onClubChange = (event) => {
    this.setState({ newClub: event.target.value });
  }

  onUsernameChange = (event) => {
    this.setState({ 
      userFirstName: event.target.value.split(" ")[0],
      userLastName: event.target.value.split(" ")[1] });
  }

  addNewClub = () => {
    
    this.state.clubList.push(this.state.newClub);
    db.addClub(this.state.userID, this.state.newClub);
    this.setState({
        newClub: '',
    });

  }

  onClassChange = (event) => {
    this.setState({ newClass: event.target.value });

  }

  addNewClass = (block) => {
    //renders locally 
    this.state.classList.push(this.state.newClass);
    db.addClass(this.state.userID, block, this.state.newClass);
    
    //adds event to calendar 
    var event =  {
      title: this.state.newClass,
      className: 'eTypeClass',
      id: this.state.newClass + block,
      startRecur: '2020-03-30',
      endRecur: '2020-06-06',
    }
    // add block data to event
    var eventextra = this.state.classBlockMap.get(block);
    var prop;
    for ( prop in eventextra ) {
        if ( eventextra.hasOwnProperty(prop) && !event[prop] ) {
            event[prop] = eventextra[prop];
        }
    }

    db.addCalEvent(
      this.state.userID, 
      this.state.newClass + block,
      event,
    )
    
    
    this.setState({
       newClass: '',
   });
  }


  onFirstUsernameChange= (event) => {
    this.setState({ firstusername: event.target.value });
  }

  onLastUsernameChange= (event) => {
    this.setState({ lastusername: event.target.value });
  }

  handleCancelButtonClick = (event) => {
    this.props.history.push('/');
  }

  populateFriend = (index) => {
    db.getUser(this.state.friendsIDs[index], this.goToFriend)
  }
  
  //goToFriend = (FriendID) => {
    //FriendDB.populateFriendPage(this.state.currUser, FriendID)
    //this.props.history.push('/friendprofile');

  //}

  toggleEdit = () => {
    if(this.state.editing) { //turning it back to false
    this.setState({ 
      editing:false,
    });
    db.saveEditUser(this.state.userID, this.state.userFirstName, this.state.userLastName, this.state.userYear, this.state.image)
  }
  else{
    this.setState({ 
      editing:true,
    });
  }
  }

  goToFriend = (index) => {
    console.log(this.state.bio)
    this.props.history.push({
        pathname: '/friendprofile',
        state: {friendID: this.state.friendsIDs[index]}

    })
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  renderClubs = () => {
    this.state.clubList[0] = "club1"
    this.state.clubList[1] = "club2"
    this.state.clubList[2] = "club3"
 
    return (
      <div> 
         <ul>
         { (this.state.clubList.length > 0) 
        ? <li className="item" style={{'background-color': '#ADCC80'}}>{this.state.clubList[0]}</li>
        : <div> </div>
         }
         { (this.state.clubList.length > 1) 
        ? <li className="item" style={{'background-color': '#ADCC80'}}>{this.state.clubList[1]}</li>
        : <div> </div>
         }
         { (this.state.clubList.length > 2) 
        ? <li className="item" style={{'background-color': '#ADCC80'}}>{this.state.clubList[2]}</li>
        : <div> </div>
         }
         { (this.state.clubList.length > 3) 
        ? <li className="item" style={{'background-color': '#ADCC80'}}>{this.state.clubList[3]}</li>
        : <div> </div>
         }
         {this.state.editing 
           ? <div><Input className="response"  placeholder="ex. Tri team" onChange={this.onClubChange} value={this.state.newClub} />
            <Button onClick={this.addNewClub}>Add Club</Button>  </div> 
          : <div></div>
  
         }
       
         </ul>
        </div>
     );
  }

    renderClasses = () =>  {
      { 
        this.state.classList[0] = "class1"
        this.state.classList[1] = "class2"
        this.state.classList[2] = "class3"
        this.state.classList.splice(3);
        
    }
        return (
          <div> 
            <div className="addEventModal">
              <Modal show={this.state.isOpen} save={this.saveInfo} onClose={this.toggleModal}>
              <div class="wordContainer">
                <h6 className="word">SUBJECT AREA:</h6>
                <h6 className="word">COURSE NUMBER:</h6>
                <h6 className="word">PERIOD:</h6>
                <h6 className="word">COLOR:</h6>
              </div>
              <div class="inputContainer">
                <Input style={{'margin': '18px'}} type="text" placeholder="" value={this.state.eventTitle} onChange={this.createEventTitle}/>
                <Input style={{'margin': '18px'}} type="text" placeholder="" value={this.state.eventTitle} onChange={this.createEventTitle}/>

                <div class="dropdown">
                  <Button className="dropbtn"><img src={arrow} style={{'position': 'absolute', 'left': '80%', 'top': '38%'}}></img></Button>
                  <div class="dropdown-content">
                    <a href="#" onClick={() => this.addNewClass("8")} >8</a>
                    <a href="#" onClick={() => this.addNewClass("9S")}>9S</a>
                    <a href="#" onClick={() => this.addNewClass("9L")}>9L</a>
                    <a href="#" onClick={() => this.addNewClass("10")}>10</a>
                    <a href="#" onClick={() => this.addNewClass("11")}>11</a>
                    <a href="#" onClick={() => this.addNewClass("12")}>12</a>
                    <a href="#" onClick={() => this.addNewClass("2")}>2</a>
                    <a href="#" onClick={() => this.addNewClass("3A")}>3A</a>
                    <a href="#" onClick={() => this.addNewClass("6A")}>6A</a>
                    <a href="#" onClick={() => this.addNewClass("10A")}>10A</a>
                    <a href="#" onClick={() => this.addNewClass("2A")}>2A</a>
                    <a href="#" onClick={() => this.addNewClass("3B")}>3B</a>
                    <a href="#" onClick={() => this.addNewClass("6B")}>6B</a>
                  </div>
                </div>
                <div class="colors">
                  <ul>
                    <li className="colors" style={{'background-color': '#F7DB93', 'width': '34px', 'height': '40px'}}></li>
                    <li className="colors" style={{'background-color': '#9FDBEE', 'width': '34px', 'height': '40px'}}></li>
                    <li className="colors" style={{'background-color': '#F7B0CD', 'width': '34px', 'height': '40px'}}></li>
                    <li className="colors" style={{'background-color': '#CDA8EB', 'width': '34px', 'height': '40px'}}></li>
                    <li className="colors" style={{'background-color': '#FDA3A3', 'width': '34px', 'height': '40px'}}></li>

                  </ul>

                </div>
                <Button style={{'position': 'absolute', 'left': '0%', 'top': '150%'}}>ADD CLASS</Button> 
               
              </div>
              </Modal>
            </div>
            
          <ul>
          
          { (this.state.classList.length > 0) 
         ? <div style={{'display': 'flex', 'flex-direction': 'row'}}>
            <li className="item" style={{'background-color': '#F8DD96'}}>{this.state.classList[0]}</li>
      
          </div>
         : <div> </div>
          }
          { (this.state.classList.length > 1) 
         ? <li className="item" style={{'background-color': '#CFAAEC'}}>{this.state.classList[1]}</li>
         : <div> </div>
          }
          { (this.state.classList.length > 2) 
         ? <li className="item" style={{'background-color': '#F8B2CF'}}>{this.state.classList[2]}</li>
         : <div> </div>
          }
          { (this.state.classList.length > 3) 
         ? <li className="item">{this.state.classList[3]}</li>
         : <div> </div>
          }
          <li className="item" style={{'padding-left': '0px'}}><Button onClick={this.toggleModal} className="addClass">+ ADD A CLASS</Button></li>
          
          </ul>
         </div>
      );

     

    }


  render() {
    return (
      <div className="allProfile">
        <div className="navBar">
            <div className="dartCalLogoNav">
                <NavLink to="/calendar" style={{ textDecoration: 'none', color: '#565C57'}}>
                  DartCal
                  <img width="45px" src={logo} style={{'margin-left':'5%', 'verticalAlign': 'text-top'}}/>
                </NavLink>
            </div>
        </div>

        <div className="infoBlock">
          <div>
          {this.state.editing
            ? <div>
              <h6>Insert Image URL</h6>  
              <Input className="response"  placeholder="Image URL " onChange={this.onImageChange}  value={this.state.image} />
              </div>
             :<img className="profile" src={this.state.image} width="195px" height="195px" style={{'border-color':'#000000'}}/>
            }
          </div>
          <div className="name">
            {this.state.editing
             ? <Input onChange={this.onUsernameChange} value={`${this.state.userFirstName} ${this.state.userLastName}`} />
              :<h6>{`${this.state.userFirstName} ${this.state.userLastName}`} '{this.state.userYear.substring(2)}</h6>
            }
          </div>
          <div style={{'position': 'relative', 'top': '-3%'}}>
            {this.state.editing
            ? <Button onClick={this.toggleEdit} className="setting">Save Profile</Button>
            :<Button className="setting" onClick={this.toggleEdit}>
              <img width="30px" src={settings} style={{'position': 'relative', 'top': '6px', 'left': '-10px'}}/>
              Edit Profile
              </Button>
            }
          </div>
          <div class="infoContainer">
              <p className="info" style={{'font-size': '24px'}}>EMAIL:</p>
              <p className="info" style={{'margin-top': '-15px', 'margin-bottom': '30px', 'font-size': '18px'}}>{this.state.userEmail}</p>
              <p className="info" style={{'font-size': '24px'}}>PASSWORD:</p>
              <p className="info" style={{'margin-top': '-15px', 'margin-bottom': '30px', 'font-size': '18px'}}>***********</p>
          </div>
        </div>

        <div class="classContainer">
          <h3 style={{'text-align': 'left', 'margin-top': '-3px'}}>CLASSES</h3>
          {this.renderClasses()}
        </div>

        <div class="clubContainer">
          <h3 style={{'text-align': 'left', 'margin-top': '-3px'}}>CLUBS</h3>
          {this.renderClubs()}
        </div>

        <div class="friendContainer">
          <h3 style={{'text-align': 'left', 'margin-top': '-3px'}}>FRIENDS</h3>
          <ul>
          
          { (this.state.classList.length > 0) 
         ? <div>
              <img onClick={() => this.goToFriend(0)} src={this.state.friendsPics[0]} className="friend"/>

            </div>
    
         : <div> </div>
          }
          { (this.state.classList.length > 1) 
         ? <div>
          <img onClick={() => this.goToFriend(1)} src={this.state.friendsPics[1]} className="friend"/>
        
       </div>
         : <div> </div>
          }
          { (this.state.classList.length > 2) 
         ? <div>
          <img onClick={() => this.goToFriend(1)} src={this.state.friendsPics[2]} className="friend"/>
        
       </div>
         : <div> </div>
          }
          { (this.state.classList.length > 3) 
         ? <div>
          <img onClick={() => this.goToFriend(1)} src={this.state.friendsPics[3]} className="friend"/>
     
       </div>
         : <div> </div>
          }
          <li className="item" style={{'padding-left': '0px'}}><NavLink to="/searchfriends"><Button className="addFriend" >+ ADD A FRIEND</Button></NavLink></li>


         
          
          </ul>
        </div>





        {/*

        <div className="profileinfo">
          <div>
            <h3 className="sectionHeader">Profile</h3>
            <div className="imgStyle">
            {this.state.editing
             ? <div>
               <h6>Insert Image URL</h6>  
             <Input className="response"  placeholder="Image URL " onChange={this.onImageChange}  value={this.state.image} />
              </div>
             :<img class="a" src={this.state.image} width="150" height="150"/>


            }
            </div>
          </div>
          <div className="nameContainer">
            <h6>Name</h6>
            <h6>Email</h6>
            <h6>Password</h6>
            <h6>Year</h6>
          </div>
          <div className="inputContainer">
            <div className="indivInput">
            {this.state.editing
             ? <Input className="response"  onChange={this.onUsernameChange} value={`${this.state.userFirstName} ${this.state.userLastName}`} />
              :<h6>{`${this.state.userFirstName} ${this.state.userLastName}`}</h6>
            }
            </div>
            <div className="indivInput">
              <h6>{this.state.userEmail}</h6>
            </div>
            <div className="indivInput">
              <h6>***********</h6>
            </div>
            <div className="indivInput">
              {this.state.editing
              ? <Input className="response"  onChange={this.onYearChange} value={this.state.userYear} />
              : <h6>{this.state.userYear}</h6>
            }
             
            </div>
          </div>
        </div>

        <div className="classinfo">
          <div>
            <h3 className="sectionHeader">Classes</h3>
          </div>
          <div className="listStyle">
           {this.renderClasses()}
          </div>
        </div>

        <div className="clubinfo">
          <div>
            <h3 className="sectionHeader">Clubs</h3>
          </div>
          <div className="listStyle">

          {this.renderClubs()}
                   
          </div>
        </div>

        <div className="friendsinfo">
          <div>
            <h3 className="sectionHeader">Friends</h3>
          </div>
          <div class="grid-container">
            <div class="grid-item">
              <div className="imgStyle">
                <img class="a" onClick={() => this.goToFriend(0)} src={this.state.friendsPics[0]}  width="55%" height="55%"/>
                <p  onClick={() => this.goToFriend(0)}>{this.state.friendsNames[0]}</p>
              </div>
            </div>
              <div class="grid-item">
              <div className="imgStyle">
                <img class="a" onClick={() => this.goToFriend(1)} src={this.state.friendsPics[1]} width="55%" height="55%"/>
                <p onClick={() => this.goToFriend(1)}>{this.state.friendsNames[1]}</p>
              </div>
            </div>
            <div class="grid-item">
              <div className="imgStyle">
                <img class="a" src={this.state.friendsPics[2]} width="55%" height="55%"/>
                <p>{this.state.friendsNames[2]}</p>
              </div>
            </div>  
            <div class="grid-item">
              <div className="imgStyle">
                <img class="a" src={this.state.friendsPics[3]} width="55%" height="55%"/>
                <p>{this.state.friendsNames[3]}</p>
              </div>
            </div>
            <div class="grid-item">
              <div className="imgStyle">
                <img class="a" src={this.state.friendsPics[4]} width="55%" height="55%"/>
                <p>{this.state.friendsNames[4]}</p>
              </div>
            </div>
            <div class="grid-item">
              <div className="imgStyle">
                <img class="a" src={this.state.friendsPics[5]} width="55%" height="55%"/>
                <p>{this.state.friendsNames[5]}</p>
              </div></div> 
              <div className="addFriends">
                <NavLink to="/searchfriends">
                  <img width="50px" src="https://cdn0.iconfinder.com/data/icons/social-media-glyph-1/64/Facebook_Social_Media_User_Interface-35-512.png" style={{ 'vertical-align':'middle', 'mix-blend-mode': 'soft-light'}}/> 
                  Add Friends
                </NavLink>
              </div>
          </div>
        </div>
        <div className="editOrFollowButton">
        {this.state.editing
         ? <Button onClick={this.toggleEdit}>Save Profile</Button>
         :<Button onClick={this.toggleEdit}>Edit Profile</Button>
        }
        </div>
        <div className="logoutContainer">
          <img width="50px" src="https://cdn3.iconfinder.com/data/icons/mixed-communication-and-ui-pack-1/48/general_pack_NEW_glyph_logout_signout-512.png" style={{ 'vertical-align':'middle', 'mix-blend-mode': 'soft-light'}}/> 
          <NavLink to="/" onClick={db.signOut}>Logout</NavLink>
        </div>
        <div className="calendarContainer">
          <NavLink to="/calendar">
            <img width="50px" src={logo} style={{ 'vertical-align':'middle', 'mix-blend-mode': 'soft-light'}}/>
            Calendar
          </NavLink>
        </div>
        */}


      </div>
    );
  }
}



// export default NewPost;
export default withRouter((Profile));