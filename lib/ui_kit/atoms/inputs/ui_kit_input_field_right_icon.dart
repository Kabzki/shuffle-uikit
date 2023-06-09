import 'package:flutter/material.dart';
import 'package:shuffle_uikit/foundation/colors_foundation.dart';
import 'package:shuffle_uikit/themes/input_state_color.dart';
import 'package:shuffle_uikit/themes/ui_kit_theme_data.dart';
import 'package:shuffle_uikit/ui_kit/atoms/inputs/input_field.dart';

class UiKitInputFieldRightIcon extends StatefulWidget implements UiKitInputField {
  const UiKitInputFieldRightIcon({
    Key? key,
    required this.controller,
    this.errorText,
    this.hintText,
    this.validator,
    this.enabled = true,
  }) : super(key: key);

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
  State<UiKitInputFieldRightIcon> createState() => _UiKitInputFieldRightIconState();
}

class _UiKitInputFieldRightIconState extends State<UiKitInputFieldRightIcon> {
  final inputPropertiesColor = const InputStateColor();

  @override
  Widget build(BuildContext context) {
    return Builder(
      builder: (context) {
        final uiKitTheme = Theme.of(context).extension<UiKitThemeData>();
        final inputTheme = uiKitTheme?.iconInputTheme;
        final errorStyle = uiKitTheme?.regularTextTheme.caption2.copyWith(color: ColorsFoundation.error);
        final inputTextStyle = uiKitTheme?.boldTextTheme.caption1Medium.copyWith(color: Colors.white);
        final hintStyle = uiKitTheme?.boldTextTheme.caption1UpperCaseMedium.copyWith(
          color: widget.enabled ? Colors.white.withOpacity(0.48) : ColorsFoundation.solidGreyText.withOpacity(0.16),
        );
        return Theme(
          data: Theme.of(context).copyWith(
            inputDecorationTheme: inputTheme,
            disabledColor: ColorsFoundation.darkNeutral.withOpacity(0.16),
          ),
          child: TextFormField(
            enabled: widget.enabled,
            controller: widget.enabled ? widget.controller : null,
            validator: widget.validator,
            style: inputTextStyle,
            decoration: InputDecoration(
              hintText: widget.hintText,
              errorText: widget.errorText,
              errorStyle: errorStyle,
              errorMaxLines: 1,
              hintStyle: hintStyle,
              suffixIconColor: inputPropertiesColor,
              suffixIcon: IconButton(
                icon: const Icon(Icons.close),
                onPressed: () {
                  widget.controller.clear();
                },
                visualDensity: VisualDensity.compact,
                splashRadius: 5,
              ),
            ),
          ),
        );
      },
    );
  }
}
