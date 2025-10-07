import { Card, Typography, Form, Radio } from 'antd';
import { Category } from '../../../types';

type PricingProps = {
  selectedCategory: string;
}

export const Attributes = ({ selectedCategory }: PricingProps) => {
  const category: Category | null = selectedCategory ? JSON.parse(selectedCategory): null;
  if (!category) {
    return null;
  }
  console.log("categories:==========", category.attributes)

  return (
    <Card title={<Typography.Text>
      Attributes {category.attributes[0].widgetType}
    </Typography.Text>} bordered={false}>
      {category.attributes.map((attribute) => {
        return (
          <div key={attribute.name}>
            {
              attribute.widgetType === 'switch' ? (<Form.Item label={attribute.name} name={['attributes', attribute.name]}initialValue={attribute.defaultValue}
              rules={[
            {required: true,
              message: `${attribute.name} is required`
            },
          ]}> {attribute.name}
          <Radio.Group>
            {attribute.availableOptions.map((option) => {
              return (
                <Radio.Button value={option} key={option}>
                  {option}
                </Radio.Button>
              )
            })}
          </Radio.Group>
        </Form.Item>) : attribute?.widgetType === 'radio' ? ('switch'): null
            }
          </div>
        )
      })
      }
    </Card>
  )
}
