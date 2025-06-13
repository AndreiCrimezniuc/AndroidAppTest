package com.nokogiriwatir.GridApp

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.facebook.soloader.SoLoader
import com.sun.jna.Library
import com.sun.jna.Native
import com.sun.jna.Pointer
import com.sun.jna.StringArray
import com.sun.jna.ptr.PointerByReference

interface GridLibrary : Library {
    fun Start(ctoken: String): String
    fun GetLibVersion(): String

    companion object {
        private const val TAG = "GridLibrary"
        private var instance: GridLibrary? = null
        
        fun getInstance(): GridLibrary {
            if (instance == null) {
                try {
                    Log.d(TAG, "Starting native library loading process")
                    
                    // Try loading with SoLoader first (recommended for React Native)
                    try {
                        Log.d(TAG, "Attempting to load library with SoLoader")
                        SoLoader.loadLibrary("grid")
                        Log.d(TAG, "Successfully loaded library with SoLoader")
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to load with SoLoader, trying System.loadLibrary", e)
                        try {
                            Log.d(TAG, "Attempting to load library with System.loadLibrary")
                            System.loadLibrary("grid")
                            Log.d(TAG, "Successfully loaded library with System.loadLibrary")
                        } catch (e2: Exception) {
                            Log.e(TAG, "Failed to load with System.loadLibrary", e2)
                            throw e2
                        }
                    }
                    
                    Log.d(TAG, "Attempting to create native interface")
                    instance = Native.load("grid", GridLibrary::class.java)
                    Log.d(TAG, "Successfully created native interface")
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to load native library", e)
                    Log.e(TAG, "Error type: ${e.javaClass.name}")
                    Log.e(TAG, "Error message: ${e.message}")
                    e.printStackTrace()
                    throw RuntimeException("Failed to load native library: ${e.message}")
                }
            }
            return instance!!
        }
    }
}

@ReactModule(name = GridLibraryModule.NAME)
class GridLibraryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "GridLibrary"
        private const val TAG = "GridLibraryModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun callGetLibVersion(promise: Promise) {
        try {
            Log.d(TAG, "Calling GetLibVersion")
            val version = GridLibrary.getInstance().GetLibVersion()
            if (version != null) {
                Log.d(TAG, "GetLibVersion succeeded: $version")
                promise.resolve(version)
            } else {
                Log.e(TAG, "GetLibVersion returned null")
                promise.reject("GO_GET_VERSION_ERROR", "Version is null")
            }
        } catch (e: Exception) {
            Log.e(TAG, "GetLibVersion failed", e)
            Log.e(TAG, "Error type: ${e.javaClass.name}")
            Log.e(TAG, "Error message: ${e.message}")
            e.printStackTrace()
            promise.reject("GO_GET_VERSION_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun callStart(input: String, promise: Promise) {
        try {
            Log.d(TAG, "Calling Start with input: $input")
            val result = GridLibrary.getInstance().Start(input)
            if (result != null) {
                Log.d(TAG, "Start succeeded: $result")
                promise.resolve(result)
            } else {
                Log.d(TAG, "Start returned null, treating as success")
                promise.resolve("Success")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Start failed", e)
            Log.e(TAG, "Error type: ${e.javaClass.name}")
            Log.e(TAG, "Error message: ${e.message}")
            e.printStackTrace()
            promise.reject("GO_START_ERROR", e.message, e)
        }
    }
} 