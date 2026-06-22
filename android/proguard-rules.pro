# ProGuard rules for Cracklix Android APK

# Keep all Capacitor classes
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }

# Keep all Firebase classes
-keep class com.google.firebase.** { *; }
-keep interface com.google.firebase.** { *; }

# Keep all Androidx classes
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep custom application classes
-keep class com.cracklix.app.** { *; }

# Keep WebView related classes
-keep class android.webkit.** { *; }

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Optimization
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# Removals
-dontwarn android.webkit.**
-dontwarn androidx.**
-dontwarn com.google.firebase.**
-dontwarn java.lang.invoke.**
