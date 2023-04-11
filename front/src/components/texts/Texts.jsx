import React from "react";

const Texts = ({ textsData, loading }) => {
  const { loading = false } = props;
  return (
    <div>
      {!!textsData.stack.length ? (
        {textsData.forEach((text) => {
          <TextCard key={text._id} title={text.title} expressions={text.expressions} />
        })}
        // <Stack spacing={2}>
        //   {textsData.forEach((text) => {
        //     <Item key={text._id}>{text.title}</Item>;
        //   })}

        //   <Item>Item 2</Item>
        //   <Item>Item 3</Item>
        // </Stack>
      ) : (
        <div>No texts found</div>
      )}
    </div>
  );
};

export default Texts;
