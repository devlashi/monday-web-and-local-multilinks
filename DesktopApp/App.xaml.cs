using DesktopApp.Services;
using Windows.Services.Maps;

namespace DesktopApp
{
    public partial class App : Application
    {
        public App(LocalApiService apiService)
        {
            InitializeComponent();
            Task.Run(() => apiService.StartAsync());
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            return new Window(new MainPage()) { Title = "Viskode desktop connector for monday.com" };
        }
    }
}
