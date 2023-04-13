import 'package:example/presentation/routing/app_router.dart';
import 'package:example/presentation/routing/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:shuffle_uikit/shuffle_uikit.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
  usePathUrlStrategy();
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  ThemeData _theme = UiKitThemeFoundation.fallbackTheme;

  @override
  Widget build(BuildContext context) {
    return UiKitThemeProvider(
      onThemeUpdated: (theme) => setState(() => _theme = theme),
      child: MaterialApp(
        title: 'Shuffle Demo',
        debugShowCheckedModeBanner: false,
        theme: _theme,
        onGenerateRoute: AppRouter.onGenerateRoute,
        initialRoute: AppRoutes.initial,
      ),
    );
  }
}
