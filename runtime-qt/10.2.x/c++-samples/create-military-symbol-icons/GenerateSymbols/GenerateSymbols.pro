#-------------------------------------------------
#
# Project created by QtCreator 2015-08-07T12:29:40
#
#-------------------------------------------------

QT += positioning core gui opengl xml network widgets sensors

TARGET = GenerateSymbols
TEMPLATE = app

CONFIG += c++11 esri_runtime_qt10_2_6
win32:CONFIG += \
  embed_manifest_exe


SOURCES += main.cpp\
        mainwindow.cpp

HEADERS  += mainwindow.h
