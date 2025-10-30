import React from 'react';
import type { Widget } from '@openai/chatkit';
import { Card } from './containers/Card';
import { ListView } from './containers/ListView';
import { BasicRoot } from './containers/BasicRoot';
import { Box, Row, Col } from './layout/Box';
import { Form } from './layout/Form';
import { Spacer } from './layout/Spacer';
import { Divider } from './layout/Divider';
import { TextComponent } from './content/TextComponent';
import { Title } from './content/Title';
import { Caption } from './content/Caption';
import { MarkdownComponent } from './content/Markdown';
import { Badge } from './content/Badge';
import { Icon } from './content/Icon';
import { ImageComponent } from './content/Image';
import { Button } from './interactive/Button';
import { Input } from './forms/Input';
import { Textarea } from './forms/Textarea';
import { Select } from './forms/Select';
import { DatePicker } from './forms/DatePicker';
import { Checkbox } from './forms/Checkbox';
import { RadioGroup } from './forms/RadioGroup';
import { Label } from './forms/Label';

/**
 * Widget renderer - maps widget types to React Native components
 */
export function WidgetRenderer({ widget }: { widget: any }): JSX.Element | null {
  if (!widget || !widget.type) {
    return null;
  }

  switch (widget.type) {
    // Root containers
    case 'card':
      return <Card {...widget} />;
    case 'list_view':
      return <ListView {...widget} />;
    case 'basic_root':
      return <BasicRoot {...widget} />;

    // Layout
    case 'box':
      return <Box {...widget} />;
    case 'row':
      return <Row {...widget} />;
    case 'col':
      return <Col {...widget} />;
    case 'form':
      return <Form {...widget} />;
    case 'spacer':
      return <Spacer {...widget} />;
    case 'divider':
      return <Divider {...widget} />;

    // Content
    case 'text':
      return <TextComponent {...widget} />;
    case 'title':
      return <Title {...widget} />;
    case 'caption':
      return <Caption {...widget} />;
    case 'markdown':
      return <MarkdownComponent {...widget} />;
    case 'badge':
      return <Badge {...widget} />;
    case 'icon':
      return <Icon {...widget} />;
    case 'image':
      return <ImageComponent {...widget} />;

    // Interactive
    case 'button':
      return <Button {...widget} />;

    // Forms
    case 'input':
      return <Input {...widget} />;
    case 'textarea':
      return <Textarea {...widget} />;
    case 'select':
      return <Select {...widget} />;
    case 'date_picker':
      return <DatePicker {...widget} />;
    case 'checkbox':
      return <Checkbox {...widget} />;
    case 'radio_group':
      return <RadioGroup {...widget} />;
    case 'label':
      return <Label {...widget} />;

    default:
      console.warn(`Unknown widget type: ${widget.type}`);
      return null;
  }
}
