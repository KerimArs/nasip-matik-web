import webbrowser
import subprocess
import time
import os
import sys

def main():
    print("🚀 NasipMatik Web Başlatılıyor...")
    
    # URL
    url = "http://localhost:5173"
    
    # Start npm run dev in current directory
    try:
        print("⚡ Sunucu açılıyor...")
        # Use Popen to run in background
        # cwd defaults to current directory, so we don't need to change it if running from project root
        process = subprocess.Popen(["npm", "run", "dev"], shell=True)
        
        print(f"🌍 Tarayıcı açılıyor: {url}")
        time.sleep(3) # Wait for vite
        
        webbrowser.open(url, new=0)
        
        print("\n⚠️  Durdurmak için bu pencereyi kapatabilirsin.")
        process.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 Durduruluyor...")
        process.terminate()
    except Exception as e:
        print(f"\n❌ Hata: {e}")
        input("Kapatmak için Enter'a bas...")

if __name__ == "__main__":
    main()
