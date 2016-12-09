/**
 * Created by ruimin on 2016/12/5.
 */
'use strict';

import {Bim} from '../bim/bim';
const bim = new Bim();
let instance = null;

export function login(address, username, password) {
  // address = 'http://192.168.102.28:8085/bimserverwar-1.5.62';
  // username = 'admin@admin.com';
  // password = '123';
  address = 'http://122.114.175.19:8083/bimserverwar-1.5.62';
  username = 'admin@admin.com';
  password = '123';

  return bim.connect(address, username, password).then((ins) => {
    instance = ins;
    return ins;
  });
}

export function getProjectsTree() {
  return instance.getAllProjects().then((res) => {
    return instance.makeProjectTree(res);
  });
}

export function loadModel(oid, lastRevisionId, divId) {
  return instance.loadModel(oid, lastRevisionId, divId);
}

/*
 let bim = new Bim();
 let address = 'http://192.168.102.28:8085/bimserverwar-1.5.62';
 let username = 'admin@admin.com';
 let password = '123';
 bim.connect(address, username, password).then((instance) => {
 console.log('success', instance);
 instance.getAllProjects().then((res) => {
 console.log('all projects', res);

 let projects = instance.makeProjectTree(res);
 console.log('projects', projects);

 instance.loadModel(720897, 720899, "bim").then((viewControl) => {
 // viewControl.setColor()
 console.log('viewControl', viewControl);
 viewControl.getTree().then((data) => {
 console.log('viewControl.getTree()', data);
 })
 });
 }).catch((err) => {
 console.log('err', err);
 });
 }).catch((err) => {
 console.log('err', err);
 })
 */