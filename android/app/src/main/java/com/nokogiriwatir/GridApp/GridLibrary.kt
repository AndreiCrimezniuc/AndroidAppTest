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
     fun Start(ctoken: String): String?
     fun GetLibVersion(): String?

     companion object {
         private const val TAG = "GridLibrary"
         private var instance: GridLibrary? = null

         fun getInstance(): GridLibrary {
             if (instance == null) {
                 synchronized(this) {
                     if (instance == null) {
                         try {
                             Log.d(TAG, "Loading native library 'grid'")

                             // Use SoLoader for React Native
                             SoLoader.loadLibrary("grid")

                             Log.d(TAG, "Creating JNA interface")
                             instance = Native.load("grid", GridLibrary::class.java)
                             Log.d(TAG, "Successfully initialized GridLibrary")

                         } catch (e: Exception) {
                             Log.e(TAG, "Failed to initialize GridLibrary: ${e.message}", e)
                             throw RuntimeException("Failed to load native library 'grid': ${e.message}", e)
                         }
                     }
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
      Thread {
          try {
              Log.d(TAG, "Calling Start with input: $input")
              GridLibrary.getInstance().Start(input)
              Log.d(TAG, "Start completed successfully")
              promise.resolve(null)
          } catch (e: Exception) {
              Log.e(TAG, "Start failed", e)
              promise.reject("GO_START_EXCEPTION", e.message, e)
              return@Thread
          }
      }.start()

      // Запускаем таймер в отдельном потоке, чтобы не блокировать основной
      Thread {
          Thread.sleep(5000)
          promise.resolve(null)
      }.start()
  }

   }
