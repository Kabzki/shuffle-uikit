import 'package:example/presentation/ui/showcase/all_widgets_stand.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shuffle_uikit/foundation/theme_foundation.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shuffle Demo',
      debugShowCheckedModeBanner: false,
      theme: UiKitThemeFoundation.defaultTheme,
      home: const AllWidgetsStand(),
    );
  }
}
