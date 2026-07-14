import "./globals.css";

export const metadata = {
  title: "Lynk & Co Master Configurator Dashboard",
  description: "Dashboard interno de configuración de vehículos Lynk & Co",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
