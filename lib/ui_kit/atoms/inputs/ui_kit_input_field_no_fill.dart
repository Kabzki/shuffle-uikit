import 'package:flutter/material.dart';
import 'package:shuffle_uikit/themes/ui_kit_theme_data.dart';
import 'package:shuffle_uikit/ui_kit/atoms/inputs/input_field.dart';

import '../../../foundation/colors_foundation.dart';

class UiKitInputFieldNoFill extends StatelessWidget implements UiKitInputField {
  const UiKitInputFieldNoFill({
    Key? key,
    required this.controller,
    this.errorText,
    this.hintText,
    this.validator,
    this.enabled = true,
    required this.label,
  }) : super(key: key);

  final String label;
  @override
  final TextEditingController controller;
  @override
  final bool enabled;
  @override
  final String? errorText;
  @override
  final String? hintText;
  @override
  final String? Function(String? p1)? validator;

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (context) {
        final uiKitTheme = Theme.of(context).extension<UiKitThemeData>();
        final inputTheme = uiKitTheme?.noFillInputTheme;
        final errorStyle = uiKitTheme?.regularTextTheme.caption2.copyWith(color: ColorsFoundation.error);
        final inputTextStyle = uiKitTheme?.boldTextTheme.caption1Medium.copyWith(color: Colors.white);
        final labelStyle = uiKitTheme?.regularTextTheme.labelSmall.copyWith(
          color: enabled ? ColorsFoundation.inputLabelGrey : ColorsFoundation.solidGreyText,
        );
        final hintStyle = uiKitTheme?.boldTextTheme.caption1UpperCaseMedium.copyWith(
          color: enabled ? Colors.white.withOpacity(0.48) : ColorsFoundation.solidGreyText.withOpacity(0.16),
        );
        return Theme(
          data: Theme.of(context).copyWith(
            inputDecorationTheme: inputTheme,
            disabledColor: ColorsFoundation.darkNeutral.withOpacity(0.16),
          ),
          child: TextFormField(
            enabled: enabled,
            controller: enabled ? controller : null,
            style: inputTextStyle,
            decoration: InputDecoration(
              hintText: hintText,
              labelText: label,
              labelStyle: labelStyle,
              hintStyle: hintStyle,
              errorText: errorText,
              errorMaxLines: 1,
              errorStyle: errorStyle,
            ),
          ),
        );
      },
    );
  }
}
