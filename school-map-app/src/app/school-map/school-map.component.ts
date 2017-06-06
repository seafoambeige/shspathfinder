import {Component, NgModule, OnInit} from '@angular/core';
import {SchoolMapService} from '../school-map.service';
import {Room} from '../room/room';

import {Point} from '../room/point';
import {SchoolMap} from '../room/map';

/*declare function  scrollToRoom(): any {
};*/



@Component({
  selector: 'app-school-map',
  templateUrl: './school-map.component.html',
  styleUrls: ['./school-map.component.css']
})
export class SchoolMapComponent implements OnInit {
  // name, x, y, width, height
  private start: string;
  private end: string;
  private zoomFactor = 10;

  private xOffSet = 25;
  private yOffSet = 50;

  private path = [];
  private showDirectionBox = false;
  private error = '';

  private startRoom: Room;
  private endRoom: Room;


  private schoolMap:SchoolMap;
  private floorName: string;
  private nFloor: number;
  private shortestPath:[Point[],Point[]] = [[],[]];  // stores shortest path on each floor by floor num



  private setFloor(nFloor:number) {
    this.nFloor = nFloor;
    this.schoolMap = this.schoolMapService.getMap(nFloor);
    this.floorName = this.schoolMap.name;
    this.path = this.shortestPath[this.nFloor];
  }

  constructor( private schoolMapService: SchoolMapService ) {
    //   console.log(this.schoolMap[0]);
    //   console.log(this.schoolMap[0].getHeight());
    this.setFloor(0);
  }

  private changeFloor() {
    if( this.nFloor === 0) {
      this.setFloor(1);
    }else {
      this.setFloor(0);
    }
  }




  private changeStart(room:Room) {
    const self = this;
    if( !room ) {
      self.error = 'Sorry: you need to select a valid start room. ';
    } else {
      this.startRoom= room;
      self.error = '';

    }
  }

  private changeEnd(room:Room) {
    const self = this;
    if( !room ) {
      self.error = 'Sorry: you need to select a valid end room. ';
    } else {
      this.endRoom = room;
      self.error = '';
    }
  }
  private showPath() {
    if( !this.startRoom || !this.endRoom ) {
      this.error = 'You need both a start and end room to find a path';
    }
    if ( this.error ) {
      return;
    }

    this.shortestPath = this.schoolMapService.getPath(this.startRoom, this.endRoom);
    this.path = this.shortestPath[this.nFloor];
    if( this.path && this.path.length ) {
      this.showDirectionBox = false;
    }else {
      this.error = 'Could not find a path from ' + this.startRoom.name + ' to ' +  this.endRoom.name;
    }
  }

  private clearRoute() {
    this.path = null;
    this.shortestPath = [[],[]];
    this.startRoom = null;
    this.endRoom = null;
    this.error = '';
  }

  private showDirections() {
    this.showDirectionBox = !this.showDirectionBox;

  }

  private hideDirections() {
    this.showDirectionBox = false;
  }

  private getRoomClass(room) {
    let classes = '';

    const roomTypes = room.roomType.split(',');
    roomTypes.forEach(function(roomType){
      if( roomType === 'Normal') {
        classes += ' normal-room';
      }
      if( roomType === 'Walkable') {
        classes  +=  ' walkable-room';
      }
      if( roomType === 'Outside') {
        classes += 'outside-room';
      }
      if( roomType === 'Stair') {
        classes += 'stair';
      }
      const regExp = /(HideWall-)([1]*)([2]*)([3]*)([4]*)/;
      const matches = String(roomType).match(regExp);
      if( matches && matches.length ) {
        matches.forEach(function (match) {
          if( match === '1' || match === '2' || match === '3' || match === '4' ) {
            classes += (' hide-wall-' + match);
          }
        });
      }

    });



    if( room === this.startRoom ) {
      classes += ' start';
    }
    if(room === this.endRoom ) {
      classes += ' end';
    }

    return classes;
  }


  ngOnInit() {

  }

}
