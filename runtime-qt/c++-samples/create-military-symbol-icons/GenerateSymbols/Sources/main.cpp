#include "mainwindow.h"
#include <QApplication>
#include "ArcGISRuntime.h"

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    #ifdef Q_OS_WIN
        QCoreApplication::setAttribute(Qt::AA_UseOpenGLES);
    #endif
    MainWindow w;
    w.setMinimumWidth(800);
    w.setMinimumHeight(600);
    w.show();

    return a.exec();
}
