package com.nokogiriwatir.GridApp

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.sun.jna.Library
import com.sun.jna.Native
import com.sun.jna.Pointer
import com.sun.jna.ptr.PointerByReference

interface GridLibrary : Library {
    fun Start(ctoken: String): Pointer
    fun GetLibVersion(): Pointer

    companion object {
        val INSTANCE: GridLibrary = Native.load("grid", GridLibrary::class.java)
    }
}

@ReactModule(name = GridLibraryModule.NAME)
class GridLibraryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "GridLibrary"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun callGetLibVersion(promise: Promise) {
        try {
            val versionPtr = GridLibrary.INSTANCE.GetLibVersion()
            if (versionPtr != null) {
                val version = versionPtr.getString(0)
                promise.resolve(version)
            } else {
                promise.reject("GO_GET_VERSION_ERROR", "Version is null")
            }
        } catch (e: Exception) {
            promise.reject("GO_GET_VERSION_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun callStart(input: String, promise: Promise) {
        try {
            val resultPtr = GridLibrary.INSTANCE.Start(input)
            if (resultPtr != null) {
                val result = resultPtr.getString(0)
                promise.resolve(result)
            } else {
                promise.resolve("Success") // Go returns nil on success
            }
        } catch (e: Exception) {
            promise.reject("GO_START_ERROR", e.message, e)
        }
    }
} 