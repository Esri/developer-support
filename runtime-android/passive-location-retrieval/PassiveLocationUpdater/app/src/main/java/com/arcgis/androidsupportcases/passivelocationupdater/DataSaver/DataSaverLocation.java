package com.arcgis.androidsupportcases.passivelocationupdater.DataSaver;

/**
 * Created by alex7370 on 10/10/2016.
 */

public class DataSaverLocation {
    private float xValue;
    private float yValue;
    private long time;
    private float velocity;

    public DataSaverLocation(float xValue, float yValue, long time, float velocity) {
        this.xValue = xValue;
        this.yValue = yValue;
        this.time = time;
        this.velocity = velocity;
    }

    public float getxValue() {
        return xValue;
    }

    public void setxValue(float xValue) {
        this.xValue = xValue;
    }

    public float getyValue() {
        return yValue;
    }

    public void setyValue(float yValue) {
        this.yValue = yValue;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public float getVelocity() {
        return velocity;
    }

    public void setVelocity(float velocity) {
        this.velocity = velocity;
    }
}
