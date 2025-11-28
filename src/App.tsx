import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Switch,
  Layout,
  Typography,
  Spin,
  Alert,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Select,
} from "antd";

import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todo";
import type { Todo, TodoInput } from "./api/todo";

import { getTags, createTag } from "./api/tags";
import type { Tag as TagType } from "./api/tags";

import { useState } from "react";

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [form] = Form.useForm();

  // Get Todos
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Fetch Tags
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const availableTags = tagsData || [];

  // Create Todo
  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      message.success("Todo created successfully!");
      closeModal();
    },
  });

  // Update Todo
  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: TodoInput }) =>
      updateTodo(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      message.success("Todo updated!");
      closeModal();
    },
  });

  // Delete Todo
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      message.success("Todo deleted!");
    },
  });

  const openAddModal = () => {
    setEditingTodo(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);

    form.setFieldsValue({
      title: todo.title,
      content: todo.content,
      tags: todo.taggs?.map((t) => t.tags_id.name) || [],
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingTodo(null);
  };

  const handleSubmit = async (values: any) => {
    const selectedTags: string[] = values.tags || [];

    const existingNames = availableTags.map((t) => t.name.toLowerCase());

    const newTagNames = selectedTags.filter(
      (t) => !existingNames.includes(t.toLowerCase())
    );

    if (newTagNames.length > 0) {
      await Promise.all(newTagNames.map(createTag));
      await queryClient.refetchQueries({ queryKey: ["tags"] });
    }

    // Get updated tags list
    const updatedTags = queryClient.getQueryData<TagType[]>(["tags"]) || [];

    const finalTags = selectedTags
      .map((tagName) => {
        const tag = updatedTags.find((t) => t.name === tagName);
        return tag ? { tags_id: tag.id } : null;
      })
      .filter((t) => t !== null) as { tags_id: number }[];

    const formatted: TodoInput = {
      title: values.title,
      content: values.content,
      taggs: finalTags,
    };

    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo.id, values: formatted });
    } else {
      createMutation.mutate(formatted);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "20%",
    },
    {
      title: "Content",
      dataIndex: "content",
      width: "30%",
      render: (text: string | null) => text || "-",
    },
    {
      title: "Completed",
      dataIndex: "is_completed",
      width: "10%",
      render: (value: boolean, record: Todo) => (
        <Switch
          checked={value}
          onChange={(checked) =>
            updateMutation.mutate({
              id: record.id,
              values: { is_completed: checked },
            })
          }
        />
      ),
    },
    {
      title: "Tags",
      width: "20%",
      render: (_: any, record: Todo) => (
        <>
          {record.taggs && record.taggs.length > 0 ? (
            record.taggs.map((t) => (
              <Tag key={t.tags_id.id} color="blue">
                {t.tags_id.name}
              </Tag>
            ))
          ) : (
            <span style={{ color: "#999" }}>No tags</span>
          )}
        </>
      ),
    },
    {
      title: "Actions",
      width: "20%",
      render: (_: any, record: Todo) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this todo?"
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header style={{ background: "#001529", padding: "0 24px" }}>
        <Title style={{ color: "white", margin: 0 }} level={3}>
          Qureal Todo App (CRUD + Tags)
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <Button
          type="primary"
          onClick={openAddModal}
          style={{ marginBottom: 16 }}
        >
          + Add Todo
        </Button>

        {isLoading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert type="error" message="Failed to load todos" />
        ) : (
          <Table columns={columns} dataSource={data} rowKey="id" />
        )}
      </Content>

      <Modal
        open={isModalOpen}
        title={editingTodo ? "Edit Todo" : "Add Todo"}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Todo title" />
          </Form.Item>

          <Form.Item label="Content" name="content">
            <Input.TextArea placeholder="Todo description" />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              placeholder="Select or create tags"
              style={{ width: "100%" }}
              options={availableTags.map((t) => ({
                value: t.name,
                label: t.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default App;
