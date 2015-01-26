// State v4 finite state machine library
// http://www.steelbreeze.net/state.js
// Copyright (c) 2014 Steelbreeze Limited
// Licensed under MIT and GPL v3 licences
/// <reference path="../src/state.ts" />
function engageHead() {
    console.log("- engaging head");
}
function disengageHead() {
    console.log("- disengaging head");
}
function startMotor() {
    console.log("- starting motor");
}
function stopMotor() {
    console.log("- stopping motor");
}
var model = new FSM.StateMachine("player");
var initial = new FSM.PseudoState("initial", model, 2 /* Initial */);
var operational = new FSM.State("operational", model);
var flipped = new FSM.State("flipped", model);
var final = new FSM.FinalState("final", model);
var dhistory = new FSM.PseudoState("history", operational, 1 /* DeepHistory */);
var stopped = new FSM.State("stopped", operational);
var active = new FSM.State("active", operational).entry(engageHead).exit(disengageHead);
var running = new FSM.State("running", active).entry(startMotor).exit(stopMotor);
var paused = new FSM.State("paused", active);
initial.To(operational).effect(disengageHead).effect(stopMotor);
dhistory.To(stopped);
stopped.To(running).when(function (command) {
    return command === "play";
});
active.To(stopped).when(function (command) {
    return command === "stop";
});
running.To(paused).when(function (command) {
    return command === "pause";
});
paused.To(running).when(function (command) {
    return command === "play";
});
operational.To(flipped).when(function (command) {
    return command === "flip";
});
flipped.To(operational).when(function (command) {
    return command === "flip";
});
operational.To(final).when(function (command) {
    return command === "off";
});
var context = new FSM.Context();
model.initialise(context);
model.evaluate("play", context);
model.evaluate("pause", context);
model.evaluate("flip", context);
model.evaluate("flip", context);
